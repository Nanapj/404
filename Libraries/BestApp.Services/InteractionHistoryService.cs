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
using System.Data;
using System.Text;
using System.Threading.Tasks;
using static BestApp.Services.InteractionHistoryService;
using System.Data.Entity;

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
            IQueryable<InteractionHistoryViewModel> GetAllInteractionHistorys();
            IEnumerable<InteractionHistoryViewModel> GetInteractionHistoryByCustomer(SearchViewModel model);
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly CustomerService _customerService;
        private readonly EventTypeService _eventTypeService;
        private readonly EventPurposeService _eventPurposeService;
        private readonly IRepositoryAsync<InteractionHistory> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public InteractionHistoryService(IRepositoryAsync<InteractionHistory> repository,
             EventService eventService,
              EventTypeService eventTypeService,
             EventPurposeService eventPurposeService,
             CustomerService customerService) : base(repository)
        {
            _eventService = eventService;
            _customerService = customerService;
            _eventTypeService = eventTypeService;
            _eventPurposeService = eventPurposeService;
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<InteractionHistoryViewModel> GetAllInteractionHistorys()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new InteractionHistoryViewModel()
            {
                ID = x.Id,
                EventCode = x.Event.Code,
                EventID = x.Event.Id,
                CreatDate = x.CreatDate,
                Note = x.Note
            });
        }
        public Task<IQueryable<InteractionHistoryViewModel>> GetAllInteractionHistorysAsync()
        {
            return Task.Run(() => GetAllInteractionHistorys());
        }
      
        public IEnumerable<InteractionHistoryViewModel> GetInteractionHistoryByCustomer(SearchViewModel model)
        {
            var findCus = _customerService.Queryable().Where(x => x.PhoneNumber == model.PhoneNumber && x.Delete == false).FirstOrDefault();
            if(findCus != null)
            {
                var result = new List<InteractionHistoryViewModel>();
                //result1.CustomerName = findCus.Name;
                //result1.CustomerPhone = findCus.PhoneNumber;
                var listEvent = _eventService.Queryable().Include(x => x.DetailEvents).Where(x => x.Customer.Id == findCus.Id).ToList();
                if(listEvent != null)
                {
                    foreach(var item in listEvent)
                    {
                        var history = Queryable().Where(x => x.Event.Id == item.Id).ToList();
                        if(history != null)
                        {
                            foreach(var itemHistory in history)
                            {
                                var Object1 = new InteractionHistoryViewModel();
                                Object1.Type = itemHistory.Type;
                                Object1.ID = itemHistory.Id;
                                Object1.CreatDate = itemHistory.CreatDate.ToLocalTime();
                                Object1.EmployeeCall = itemHistory.EmployeeCall;
                                Object1.EmployeeID = itemHistory.EmployeeID;
                                Object1.EventCode = item.Code;
                                Object1.Status = item.Status;
                                Object1.EventNote = item.Note;
                                Object1.Note = itemHistory.Note;
                                Object1.EventPurpose = _eventPurposeService.Queryable()
                                                    .Where(t => t.Delete == false && t.Id == item.EventPurposeId).FirstOrDefault().Name;
                                Object1.EventType = _eventTypeService.Queryable()
                                                    .Where(t => t.Delete == false && t.Id == item.EventTypeId).FirstOrDefault().Name;
                                 if(item.DetailEvents != null)
                                {
                                    Object1.Serial = item.DetailEvents.FirstOrDefault().Serial;
                                    Object1.DetailEventNote = item.DetailEvents.FirstOrDefault().Note;
                                   
                                }
                                result.Add(Object1);
                            }
                        }
                        
                    }
                   foreach(var item in result.ToList())
                    {
                        
                    }
                }
                else
                {
                    throw new Exception("Không tìm thấy lịch sử tương tác");
                }
                
                return result;
            }
            else
            {
                throw new Exception("Không tìm thấy khách hàng");
            }
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
