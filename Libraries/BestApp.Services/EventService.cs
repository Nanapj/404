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
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static BestApp.Services.EventService;

namespace BestApp.Services
{
    public class EventService : Service<Event>, IEventService
    {
        public interface IEventService : IService<Event>
        {
            Event Insert(EventViewModel model);
            Task<Event> InsertAsync(EventViewModel model);
            Task<EventViewModel> UpdateAsync(EventViewModel model);
            Task<IQueryable<EventViewModel>> GetAllEventsAsync(SearchViewModel model);
            IQueryable<EventViewModel> GetAllEvents(SearchViewModel model);
            bool Delete(Guid Id);
        }
        private readonly TagService _tagService;
        private readonly EventTypeService _eventTypeService;
        private readonly EventPurposeService _eventPurposeService;
        private readonly CustomerService _customerService;
        private readonly ProductTypeService _productTypeService;
        private readonly IRepositoryAsync<Event> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public EventService(IRepositoryAsync<Event> repository,
             TagService tagService,
             EventTypeService eventTypeService,
             EventPurposeService eventPurposeService,
             CustomerService customerService,
             ProductTypeService productTypeService) : base(repository)
        {
            _tagService = tagService;
            _customerService = customerService;
            _eventTypeService = eventTypeService;
            _eventPurposeService = eventPurposeService;
            _productTypeService = productTypeService;
            _repository = repository;
           db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<EventViewModel> GetAllEvents(SearchViewModel model)
        {
            //if (model.To != null)
            //{
            //    model.To = model.To.Value.AddDays(1);
            //}
            if (model.Code != null)
            {
                var findId = Queryable().Where(x => x.Code == model.Code).Select(x => x.Id).FirstOrDefault();
                if (findId != null)
                {
                    model.ID = findId;
                }

            }
            var result = _repository.Queryable().Where(x => x.Delete == false
            && ((!model.ID.HasValue) || x.Id == model.ID)
            && ((!(model.Code == "")) || (model.Code == x.Code))
            && ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
            && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To))))
            .Select(x => new EventViewModel
            {
                CreatDate = x.CreatDate,
                ID = x.Id,
                Code = x.Code,
                CustomerID = x.Customer.Id,
                CustomerName = x.Customer.Name,
                Address = x.Customer.Address,
                PhoneNumber = x.Customer.PhoneNumber,
                EventPurposeID = x.EventPurposeId,
                EventTypeID = x.EventTypeId,
                Status = x.Status,
                UserName = x.UserAccount.UserName,
                Note = x.Note,
                Tags = x.Tags.Select(t => new TagViewModel
                {
                    ID = t.Id,
                    NameTag = t.NameTag,
                    CodeTag = t.CodeTag,
                }).ToList(),
                DetailEvents = x.DetailEvents.Select(t => new DetailEventViewModel
                {
                    ID = t.Id,
                    Serial = t.Serial,
                    CreatDate = t.CreatDate,
                    ProductCode = t.ProductType.Code,
                    ProductName = t.ProductType.Name,
                    AgencySold = t.AgencySold,
                    DateSold = t.DateSold,
                    AssociateName = t.AssociateName,
                    EventCode = t.Event.Code,
                    Note = t.Note
                }).ToList(),
                ReminderNotes = x.ReminderNotes.Select(t => new ReminderNoteViewModel
                {
                    Note = t.Note,
                    CreatDate = t.CreatDate,
                    Serial = t.Serial,
                    ID =t.Id,
                    ReminderDate = t.ReminderDate

                }).ToList(),
                InteractionHistorys = x.InteractionHistorys.Select(t => new InteractionHistoryViewModel
                {
                    ID = t.Id,
                    Type = t.Type,
                    Note = t.Note,
                    CreatDate = t.CreatDate,
                    EmployeeCall = t.EmployeeCall,
                    EmployeeID = t.EmployeeID,
                    EventCode = t.Event.Code
                }).ToList()
            }).ToList();
            foreach(var item in result)
            {
               item.EventPurposeName = _eventPurposeService.Queryable()
                    .Where(t => t.Delete == false && t.Id == item.EventPurposeID).FirstOrDefault().Name;
                item.EventTypeName = _eventTypeService.Queryable()
                    .Where(t => t.Delete == false && t.Id == item.EventTypeID).FirstOrDefault().Name;
            }
            //if(model.To != null || model.From != null)
            //{
            //    result = result.Where(x => ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
            //    && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To)))).ToList();
            //}
            
            return result.AsQueryable();
        }
        public Task<IQueryable<EventViewModel>> GetAllEventsAsync(SearchViewModel model)
        {
            
            return Task.Run(() => GetAllEvents(model));
            
        }
        public Event Insert(EventViewModel model)
        {
            var data = new Event();
            Random generator = new Random();
            var r = generator.Next(0, 999999).ToString("D6");
            var CodeEvent = "CR" + DateTime.Now.ToString("yyyy") + DateTime.Now.ToString("MM") + r;
            var find = Queryable().Where(x => x.Code == CodeEvent).Any();
            do
            {
                r = generator.Next(0, 999999).ToString("D6");
                CodeEvent = "CR" + DateTime.Now.ToString("yyyy") + DateTime.Now.ToString("MM") + r;
                find = Queryable().Where(x => x.Code == CodeEvent).Any();
            } while (find == true);
           
            data.Code = CodeEvent;
            data.Customer = _customerService.Find(model.CustomerID);
            data.Status = model.Status;
            data.EmployeeID = model.CustomerID;
            data.EventPurposeId = model.EventPurposeID;
            data.EventTypeId = model.EventTypeID;
            data.Note = model.Note;
                
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            if (model.DetailEvents != null)
            {
                data.DetailEvents = new List<DetailEvent>();
                foreach (var item in model.DetailEvents)
                {
                    data.DetailEvents.Add(new DetailEvent()
                    {
                        Serial = item.Serial,
                        AgencySold = item.AgencySold,
                        DateSold = item.DateSold,
                        AssociateName = item.AssociateName,
                        Note = item.Note,
                        ProductType = _productTypeService.Find(item.ProductID),
                        CreatDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now,
                        Delete = false
                    });
                }
            }
            if (model.Tags != null)
            {
                data.Tags = new List<Tag>();
                foreach (var item in model.Tags)
                {
                    var t = _tagService.Find(item.ID);
                    if (t != null)
                    {
                        data.Tags.Add(t);
                    }
                }
            }
            if(model.ReminderNotes != null)
            {
                data.ReminderNotes = new List<ReminderNote>();
                foreach(var item in model.ReminderNotes)
                {
                    data.ReminderNotes.Add(new ReminderNote()
                    {
                        ReminderDate = item.ReminderDate,
                        Serial = item.Serial,
                        CreatDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now,
                        Note = item.Note,
                    });
                }
            }
                
            if(model.InteractionHistorys != null)
            {
                data.InteractionHistorys = new List<InteractionHistory>();
                foreach (var item in model.InteractionHistorys)
                {
                    data.InteractionHistorys.Add(new InteractionHistory()
                    {
                        Type = item.Type,
                        Note = item.Note,
                        EmployeeCall = item.EmployeeCall,
                        EmployeeID = item.EmployeeID,
                        CreatDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now,
                        Delete = false
                    });
                }
            }
            data.CreatDate = DateTime.Now;
            data.Delete = false; 
            data.LastModifiedDate = DateTime.Now;
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            base.Insert(data);
            return data;
            

        }
        public async Task<Event> InsertAsync(EventViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public bool Update(EventViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.EventTypeId = model.EventTypeID;
                data.EventPurposeId = model.EventPurposeID;
                data.Note = model.Note;
                data.Status = model.Status;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<EventViewModel> UpdateAsync(EventViewModel model)
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
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
