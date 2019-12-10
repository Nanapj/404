using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using Repository.Repositories;
using Service;
using Service.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
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
            ReminderNote Insert(ReminderNoteViewModel model);
            Task<ReminderNote> InsertAsync(ReminderNoteViewModel model);
            Task<ReminderNoteViewModel> UpdateAsync(ReminderNoteViewModel model);
            Task<IQueryable<ReminderNoteViewModel>> GetAllReminderNotesAsync();
            IQueryable<ReminderNoteViewModel> GetAllReminderNotes();
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly IRepositoryAsync<ReminderNote> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public ReminderNoteService(IRepositoryAsync<ReminderNote> repository,
            EventService eventService) : base(repository)
        {
            _repository = repository;
            _eventService = eventService;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<ReminderNoteViewModel> GetAllReminderNotes()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new ReminderNoteViewModel()
            {
                ID = x.Id,
                Note = x.Note,
                ReminderDate = x.ReminderDate,
                CreatDate = x.CreatDate,
                EventID = x.Event.Id,
                Serial = x.Serial
            });
        }
        public Task<IQueryable<ReminderNoteViewModel>> GetAllReminderNotesAsync()
        {
            return Task.Run(() => GetAllReminderNotes());
        }
        public ReminderNote Insert(ReminderNoteViewModel model)
        {
            var data = new ReminderNote();
           // var employee = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            data.Note = model.Note;
            data.Event = _eventService.Find(model.EventID);
            //data.UserAccount = employee;
            data.ReminderDate = model.ReminderDate;
            data.Serial = model.Serial;
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            base.Insert(data);
            return data;
        }
        public async Task<ReminderNote> InsertAsync(ReminderNoteViewModel model)
        {
            return await Task.Run(() => Insert(model));
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
