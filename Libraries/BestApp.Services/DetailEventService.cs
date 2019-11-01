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
            DetailEvent Insert(DetailEventViewModel model);
            Task<DetailEvent> InsertAsync(DetailEventViewModel model);
            Task<DetailEventViewModel> UpdateAsync(DetailEventViewModel model);
            Task<IQueryable<DetailEventViewModel>> GetAllDetailEventsAsync();
            IQueryable<DetailEvent> GetAllDetailEvents();
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly ProductTypeService _productTypeService;
        private readonly IRepositoryAsync<DetailEvent> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public DetailEventService(IRepositoryAsync<DetailEvent> repository,
             EventService eventService,
             CustomerService customerService,
             ProductTypeService productTypeService) : base(repository)
        {
            _eventService = eventService;
            _productTypeService = productTypeService;
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<DetailEvent> GetAllDetailEvents()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<DetailEventViewModel>> GetAllDetailEventsAsync()
        {
            return Task.Run(() => GetAllDetailEvents().Select(x => new DetailEventViewModel()
            {
                ID = x.Id,
                Serial = x.Serial,
                Note = x.Note,
                EventCode = x.Event.Code,
                EventID = x.Event.Id,
                CreatDate = x.CreatDate,
                ProductCode = x.ProductType.Code,
                ProductName = x.ProductType.Name,
            }));
        }
        public DetailEvent Insert(DetailEventViewModel model)
        {
            var data = new DetailEvent();
            data.Serial = model.Serial;
            data.Note = model.Note;
            data.Event = _eventService.Find(model.EventID);
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            data.ProductType = _productTypeService.Find(model.ProductID);
            //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
            base.Insert(data);
            return data;
        }
        public async Task<DetailEvent> InsertAsync(DetailEventViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public bool Update(DetailEventViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Serial = model.Serial;
                data.Note = model.Note;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<DetailEventViewModel> UpdateAsync(DetailEventViewModel model)
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
                throw new Exception("Không tìm thấy chi tiết phiếu");
            }
        }
    }
}
