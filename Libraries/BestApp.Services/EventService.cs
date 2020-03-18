using BestApp.Core;
using BestApp.Core.Models;
using BestApp.Domain;
using BestApp.Ultilities;
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
            Event Insert(EventViewModel model, string CurrentId);
            Task<Event> InsertAsync(EventViewModel model, string CurrentId);
            Task<EventViewModel> UpdateAsync(EventViewModel model, string CurrentId);
            Task<IQueryable<EventViewModel>> GetAllEventsAsync(SearchViewModel model);
            IQueryable<EventViewModel> GetAllEvents(SearchViewModel model);
            IQueryable<EventViewModel> GetEventForPishop(SearchViewModel model);
            Task<IQueryable<EventViewModel>> GetEventForPishopAsync(SearchViewModel model);
            IEnumerable<EventViewModel> GetEventByCustomer(SearchViewModel model);
            bool UpdateStatusSeen(Guid Id, string CurrentId);
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
             ProductTypeService productTypeService,
             IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _tagService = tagService;
            _customerService = customerService;
            _eventTypeService = eventTypeService;
            _eventPurposeService = eventPurposeService;
            _productTypeService = productTypeService;
            _repository = repository;
            _userRepository = userRepository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }

        public IQueryable<EventViewModel> GetEventForPishop(SearchViewModel model)
        {
            var result = Queryable().Where(x => x.Delete == false
                && x.Tags.Any(y => y.Departments.Id == Config.PishopID)
                && ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
                && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To))))
                .Select(x => new EventViewModel() {
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
                    StatusSeen = x.StatusSeen,
                    UserName = x.UserAccount.UserName,
                    Note = x.Note
                }).ToList();
            foreach (var item in result)
            {
                item.EventPurposeName = _eventPurposeService.Queryable()
                     .Where(t => t.Delete == false && t.Id == item.EventPurposeID).FirstOrDefault().Name;
                item.EventTypeName = _eventTypeService.Queryable()
                    .Where(t => t.Delete == false && t.Id == item.EventTypeID).FirstOrDefault().Name;
            }

            return result.AsQueryable();
        }

        public Task<IQueryable<EventViewModel>> GetEventForPishopAsync(SearchViewModel model)
        {
            return Task.Run(() => GetEventForPishop(model));
        }

        public IQueryable<EventViewModel> GetAllEvents(SearchViewModel model)
        {
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
                StatusSeen = x.StatusSeen,
                UserName = x.UserAccount.UserName,
                Note = x.Note,
                Tags = x.Tags.Select(t => new TagViewModel
                {
                    ID = t.Id,
                    NameTag = t.NameTag,
                    CodeTag = t.CodeTag,
                    DepartmentName = t.Departments.Name
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
                    EventID = t.Event.Id,
                    Note = t.Note
                }).ToList(),
                ReminderNotes = x.ReminderNotes.Select(t => new ReminderNoteViewModel
                {
                    Note = t.Note,
                    CreatDate = t.CreatDate,
                    Serial = t.Serial,
                    ID =t.Id,
                    ReminderDate = t.ReminderDate,        

                }).ToList(),
                InteractionHistories = x.InteractionHistories.Select(t => new InteractionHistoryViewModel
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
            
            return result.AsQueryable();
        }
        public Task<IQueryable<EventViewModel>> GetAllEventsAsync(SearchViewModel model)
        {
            
            return Task.Run(() => GetAllEvents(model));
            
        }
        public IEnumerable<EventViewModel> GetEventByCustomer(SearchViewModel model)
        {
            //var findId = Queryable().Where(x => x.Customer.Id == model.CustomerID).Select(x => x.Id).FirstOrDefault();
            //if (findId != null)
            //{
            //    model.ID = findId;
            //}

            var result = _repository.Queryable().Where(x => x.Delete == false
            && ((!model.CustomerID.HasValue) || x.Customer.Id == model.CustomerID)
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
                StatusSeen = x.StatusSeen,
                UserName = x.UserAccount.UserName,
                Note = x.Note,
                Tags = x.Tags.Select(t => new TagViewModel
                {
                    ID = t.Id,
                    NameTag = t.NameTag,
                    CodeTag = t.CodeTag,
                    DepartmentName = t.Departments.Name
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
                    EventID = t.Event.Id,
                    Note = t.Note
                }).ToList(),
                ReminderNotes = x.ReminderNotes.Select(t => new ReminderNoteViewModel
                {
                    Note = t.Note,
                    CreatDate = t.CreatDate,
                    Serial = t.Serial,
                    ID = t.Id,
                    ReminderDate = t.ReminderDate,

                }).ToList(),
                InteractionHistories = x.InteractionHistories.Select(t => new InteractionHistoryViewModel
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
            foreach (var item in result)
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

            return result;
        }
        public Event Insert(EventViewModel model, string CurrentId)
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
            data.StatusSeen = 0;
            data.EventPurposeId = model.EventPurposeID;
            data.UserAccount = _userRepository.Find(CurrentId);
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
                        UserAccount = _userRepository.Find(CurrentId),
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
                        data.UserAccount = _userRepository.Find(CurrentId);
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
                        UserAccount = _userRepository.Find(CurrentId),
                    });
                }
            }
                
            if(model.InteractionHistories != null)
            {
                data.InteractionHistories = new List<InteractionHistory>();
                foreach (var item in model.InteractionHistories)
                {
                    data.InteractionHistories.Add(new InteractionHistory()
                    {
                        Type = item.Type,
                        Note = item.Note,
                        EmployeeCall = item.EmployeeCall,
                        EmployeeID = item.EmployeeID,
                        CreatDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now,
                        UserAccount = _userRepository.Find(CurrentId),
                        Delete = false
                    });
                }
            }
            data.EStatusLogs = new List<EStatusLog>();
            data.EStatusLogs.Add(new EStatusLog()
            {
                CreatDate = DateTime.Now,
                LastModifiedDate = DateTime.Now,
                Status = 0,
                Note = "Nhân viên " + _userRepository.Find(CurrentId).UserName + " tạo sự kiện " + CodeEvent,
                UserAccount = _userRepository.Find(CurrentId),
                Delete = false
            });
            data.CreatDate = DateTime.Now;
            data.Delete = false; 
            data.LastModifiedDate = DateTime.Now;
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            base.Insert(data);
            return data;
            

        }
        public async Task<Event> InsertAsync(EventViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public bool Update(EventViewModel model, string CurrentId)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                if(model.EventPurposeID.ToString() != "00000000-0000-0000-0000-000000000000")
                {
                    data.EventPurposeId = model.EventPurposeID;
                }
                if(model.EventTypeID.ToString() != "00000000-0000-0000-0000-000000000000")
                {
                    data.EventTypeId = model.EventTypeID;
                }
                //kiểm tra có phải update status không 
                if(data.Status != model.Status)
                {
                    data.EStatusLogs.Add(new EStatusLog()
                    {
                        CreatDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now,
                        Status = model.Status,
                        Note = "Nhân viên " + _userRepository.Find(CurrentId).UserName + " cập nhập Status phiếu " + data.Code,
                        UserAccount = _userRepository.Find(CurrentId),
                        Delete = false
                    });
                }
                data.Note = model.Note;
                data.StatusSeen = model.StatusSeen;
                data.Status = model.Status;
                if(data.Tags != null)
                {
                    if (model.Tags != null)
                    {
                        foreach (var item in data.Tags)
                        {
                            Delete(item.Id);
                        }
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
                }
                
                data.LastModifiedDate = DateTime.Now;
                data.InteractionHistories.Add(new InteractionHistory()
                {
                    Type = "",
                    Note = "Nhân viên " + _userRepository.Find(CurrentId).UserName + " Cập nhập phiếu " + data.Code,
                    CreatDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now,
                    UserAccount = _userRepository.Find(CurrentId),
                    Event = data,
                    Delete = false
                });
               
            }
            return true;

        }
        public async Task<EventViewModel> UpdateAsync(EventViewModel model, string CurrentId)
        {
            try
            {
                await Task.Run(() => Update(model, CurrentId));
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
        public bool UpdateStatusSeen(Guid Id, string CurrentId)
        {
            var data = _repository.Find(Id);
            if (data != null)
            {
                data.StatusSeen = Core.Enum.StatusSeen.Seen;
                data.EStatusLogs.Add(new EStatusLog()
                {
                    CreatDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now,
                    Status = Core.Enum.StatusEvent.Seen,
                    Note = "Nhân viên " + _userRepository.Find(CurrentId).UserName + " cập nhập Status phiếu " + data.Code,
                    UserAccount = _userRepository.Find(CurrentId),
                    Delete = false
                });
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
