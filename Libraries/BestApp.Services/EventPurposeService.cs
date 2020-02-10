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
using static BestApp.Services.EventPurposeService;

namespace BestApp.Services
{
    public class EventPurposeService : Service<EventPurpose>, IEventPurposeService
    {
        public interface IEventPurposeService : IService<EventPurpose>
        {
            EventPurpose Insert(EventPurposeViewModel model, string CurrentId);
            Task<EventPurpose> InsertAsync(EventPurposeViewModel model, string CurrentId);
            Task<EventPurposeViewModel> UpdateAsync(EventPurposeViewModel model);
            Task<IQueryable<EventPurposeViewModel>> GetAllEventPurposesAsync();
            IQueryable<EventPurposeViewModel> GetAllEventPurposes();
            bool Delete(Guid Id);
        }
        private readonly EventTypeService _eventTypeService;
        private readonly IRepositoryAsync<EventPurpose> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public EventPurposeService(
            IRepositoryAsync<EventPurpose> repository,
            EventTypeService eventTypeService,
            IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _eventTypeService = eventTypeService;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<EventPurposeViewModel> GetAllEventPurposes()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new EventPurposeViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                EventTypeID = x.EventType.Id,
                EventTypeName = x.EventType.Name
            });
        }
        public Task<IQueryable<EventPurposeViewModel>> GetAllEventPurposesAsync()
        {
            return Task.Run(() => GetAllEventPurposes());
        }
        public EventPurpose Insert(EventPurposeViewModel model, string CurrentId)
        {
            var find = Queryable().Where(x => x.Name == model.Name && x.EventType.Id == model.EventTypeID && x.Delete == false).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Mục đích đã tồn tại");
            }
            else
            {
                var data = new EventPurpose();

                data.Name = model.Name;
                data.EventType = _eventTypeService.Find(model.EventTypeID);
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.LastModifiedDate = DateTime.Now;
                data.UserAccount = _userRepository.Find(CurrentId);
                base.Insert(data);
                return data;
            }

        }
        public async Task<EventPurpose> InsertAsync(EventPurposeViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model,CurrentId));
        }
        public bool Update(EventPurposeViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<EventPurposeViewModel> UpdateAsync(EventPurposeViewModel model)
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
                throw new Exception("Không tìm thấy mục đích");
            }
        }
    }
}
