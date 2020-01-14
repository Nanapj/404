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
using static BestApp.Services.DetailEventService;

namespace BestApp.Services
{
    public class DetailEventService : Service<DetailEvent>, IDetailEventService
    {
        public interface IDetailEventService : IService<DetailEvent>
        {
            DetailEvent Insert(DetailEventViewModel model, string CurrentId);
            Task<DetailEvent> InsertAsync(DetailEventViewModel model, string CurrentId);
            Task<DetailEventViewModel> UpdateAsync(DetailEventViewModel model, string CurrentId);
            Task<IQueryable<DetailEventViewModel>> GetAllDetailEventsAsync();
            IQueryable<DetailEventViewModel> GetAllDetailEvents();
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly ProductTypeService _productTypeService;
        private readonly InteractionHistoryService _interactionHistoryService;
        private readonly IRepositoryAsync<DetailEvent> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public DetailEventService(IRepositoryAsync<DetailEvent> repository,
             EventService eventService,
             CustomerService customerService,
             ProductTypeService productTypeService,
             InteractionHistoryService interactionHistoryService,
             IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _eventService = eventService;
            _userRepository = userRepository;
            _productTypeService = productTypeService;
            _interactionHistoryService = interactionHistoryService;
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<DetailEventViewModel> GetAllDetailEvents()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new DetailEventViewModel()
            {
                ID = x.Id,
                Serial = x.Serial,
                Note = x.Note,
                EventCode = x.Event.Code,
                EventID = x.Event.Id,
                CreatDate = x.CreatDate,
                ProductCode = x.ProductType.Code,
                ProductName = x.ProductType.Name,
                DateSold = x.DateSold,
                AgencySold = x.AgencySold,
                AssociateName = x.AssociateName,
            });
        }
        public Task<IQueryable<DetailEventViewModel>> GetAllDetailEventsAsync()
        {
            return Task.Run(() => GetAllDetailEvents());
        }
        public DetailEvent Insert(DetailEventViewModel model, string CurrentId)
        {
            var data = new DetailEvent();
            data.Serial = model.Serial;
            data.Note = model.Note;
            data.Event = _eventService.Find(model.EventID);
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            data.ProductType = _productTypeService.Find(model.ProductID);
            data.UserAccount = _userRepository.Find(CurrentId);
            data.DateSold = model.DateSold;
            data.AgencySold = model.AgencySold;
            data.AssociateName = model.AssociateName;
          
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            base.Insert(data);
            return data;
        }
        public async Task<DetailEvent> InsertAsync(DetailEventViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public bool Update(DetailEventViewModel model, string CurrentId)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Serial = model.Serial;
                data.ProductType = _productTypeService.Find(model.ProductID);
                data.AgencySold = model.AgencySold;
                data.AssociateName = model.AssociateName;
                data.DateSold = model.DateSold;
                data.Note = model.Note;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<DetailEventViewModel> UpdateAsync(DetailEventViewModel model, string CurrentId)
        {
            try
            {
                var interactionHistory = new InteractionHistoryViewModel()
                {
                    Type = "",
                    Note = "Nhân viên " + _userRepository.Find(CurrentId).UserName + " Cập nhập phiếu " + _eventService.Find(model.EventID).Code,
                    CreatDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now,
                    Delete = false,
                    EventID = model.EventID
                };   
                await Task.Run(() => Update(model, CurrentId));
                await Task.Run(() => _interactionHistoryService.InsertAsync(interactionHistory, CurrentId));
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
                throw new Exception("Không tìm thấy chi tiết phiếu");
            }
        }
    }
}
