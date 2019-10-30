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
using static BestApp.Services.InteractionHistoryService;

namespace BestApp.Services
{
    public class InteractionHistoryService : Service<InteractionHistory>, IInteractionHistoryService
    {
        public interface IInteractionHistoryService : IService<InteractionHistory>
        {
            InteractionHistory Insert(InteractionHistoryViewModel model);
            Task<InteractionHistory> InsertAsync(InteractionHistoryViewModel model);
            Task<InteractionHistoryViewModel> UpdateAsync(InteractionHistoryViewModel model);
            Task<IQueryable<InteractionHistoryViewModel>> GetAllInteractionHistorysAsync();
            IQueryable<InteractionHistory> GetAllInteractionHistorys();
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly IRepositoryAsync<InteractionHistory> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public InteractionHistoryService(IRepositoryAsync<InteractionHistory> repository,
             EventService eventService,
             CustomerService customerService) : base(repository)
        {
            _eventService = eventService;
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<InteractionHistory> GetAllInteractionHistorys()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<InteractionHistoryViewModel>> GetAllInteractionHistorysAsync()
        {
            return Task.Run(() => GetAllInteractionHistorys().Select(x => new InteractionHistoryViewModel()
            {
                ID = x.Id,
                EventCode = x.Event.Code,
                EventID = x.Event.Id,
                CreatDate = x.CreatDate,
                Note = x.Note
            }));
        }
        public InteractionHistory Insert(InteractionHistoryViewModel model)
        {
            var data = new InteractionHistory();
            data.Note = model.Note;
            data.Event = _eventService.Find(model.EventID);
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            base.Insert(data);
            return data;
        }
        public async Task<InteractionHistory> InsertAsync(InteractionHistoryViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public bool Update(InteractionHistoryViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Note = model.Note;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<InteractionHistoryViewModel> UpdateAsync(InteractionHistoryViewModel model)
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
                throw new Exception("Không tìm thấy lịch sử cuộc gọi");
            }
        }
    }
}
