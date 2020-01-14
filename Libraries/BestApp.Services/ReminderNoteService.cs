using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
using Repository.Pattern;
using Repository.Repositories;
using Service;
using Service.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static BestApp.Services.ReminderNoteService;

namespace BestApp.Services
{
    public class ReminderNoteService : Service<ReminderNote>, IReminderNoteService
    {
        public interface IReminderNoteService : IService<ReminderNote>
        {
            ReminderNote Insert(ReminderNoteViewModel model, string CurrentId);
            Task<ReminderNote> InsertAsync(ReminderNoteViewModel model, string CurrentId);
            Task<ReminderNoteViewModel> UpdateAsync(ReminderNoteViewModel model);
            Task<IQueryable<ReminderNoteViewModel>> GetAllReminderNotesAsync(string userId);
            IQueryable<ReminderNoteViewModel> GetAllReminderNotes(string userId);
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly IRepositoryAsync<ReminderNote> _repository;
        private readonly IRepositoryAsync<ApplicationUser> _userRepository;
        public ReminderNoteService(IRepositoryAsync<ReminderNote> repository,
            IRepositoryAsync<ApplicationUser> userRepository,
            EventService eventService) : base(repository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _eventService = eventService;
        }
        public IQueryable<ReminderNoteViewModel> GetAllReminderNotes(string userId)
        {
            return _repository.Queryable().Where(x => x.Delete == false && x.UserAccount.Id == userId)
            .Select(x => new ReminderNoteViewModel()
            {
                ID = x.Id,
                Note = x.Note,
                ReminderDate = x.ReminderDate,
                CreatDate = x.CreatDate,
                EventID = x.Event.Id,
                Serial = x.Serial,
                UserId = x.UserAccount.Id
            });
        }
        public Task<IQueryable<ReminderNoteViewModel>> GetAllReminderNotesAsync(string userId)
        {
            return Task.Run(() => GetAllReminderNotes(userId));
        }
        public ReminderNote Insert(ReminderNoteViewModel model, string CurrentId)
        {
            var data = new ReminderNote();
            
            data.Note = model.Note;
            data.UserAccount = model.UserAccount;
            data.Event = _eventService.Find(model.EventID);
            data.ReminderDate = model.ReminderDate;
            data.Serial = model.Serial;
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.UserAccount = _userRepository.Find(CurrentId);
            data.LastModifiedDate = DateTime.Now;
            base.Insert(data);
            return data;
        }
        public async Task<ReminderNote> InsertAsync(ReminderNoteViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public bool Update(ReminderNoteViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.ReminderDate = model.ReminderDate;
                data.Note = model.Note;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<ReminderNoteViewModel> UpdateAsync(ReminderNoteViewModel model)
        {
            try
            {
                await Task.Run(() => Update(model));
                return model;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }
        public bool Delete(Guid Id)
        {
            var result = Find(Id);
            if (result != null)
            {
                result.Delete = true; 
                result.LastModifiedDate = DateTime.Now;
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy phiếu hẹn");
            }
        }
    }
}
