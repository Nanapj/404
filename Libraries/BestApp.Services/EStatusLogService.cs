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
using static BestApp.Services.EStatusLogService;

namespace BestApp.Services
{
    public class EStatusLogService : Service<EStatusLog>, IEStatusLogService
    {
        public interface IEStatusLogService : IService<EStatusLog>
        {
            EStatusLog Insert(EStatusLogViewModel model, string CurrentId);
            Task<EStatusLog> InsertAsync(EStatusLogViewModel model, string CurrentId);
            Task<EStatusLogViewModel> UpdateAsync(EStatusLogViewModel model, string CurrentId);
            Task<IQueryable<EStatusLogViewModel>> GetAllEStatusLogsAsync(SearchViewModel model);
            IQueryable<EStatusLogViewModel> GetAllEStatusLogs(SearchViewModel model);
            bool Delete(Guid Id);
        }
        private readonly EventService _eventService;
        private readonly IRepositoryAsync<EStatusLog> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public EStatusLogService(IRepositoryAsync<EStatusLog> repository,
             EventService eventService,
             IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _eventService = eventService;
            _repository = repository;
            _userRepository = userRepository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<EStatusLogViewModel> GetAllEStatusLogs(SearchViewModel model)
        {
            var result = _repository.Queryable().Where(x => x.Delete == false
           && ((!model.ID.HasValue) || x.Id == model.ID)
           && ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
           && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To))))
           .Select(x => new EStatusLogViewModel
           {
               CreatDate = x.CreatDate,
               ID = x.Id,
               EventCode = x.Event.Code,
               EventId = x.Event.Id,
               Status = x.Status,
               Note = x.Note,
               UserName = x.UserAccount.UserName,
               
           });
            return result.AsQueryable();
        }
        public Task<IQueryable<EStatusLogViewModel>> GetAllEStatusLogsAsync(SearchViewModel model)
        {

            return Task.Run(() => GetAllEStatusLogs(model));

        }
        public EStatusLog Insert(EStatusLogViewModel model, string CurrentId)
        {
            var data = new EStatusLog();
            data.Event = _eventService.Find(model.EventId);
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            data.Status = model.Status;
            data.Note = model.Note;
            data.UserAccount = _userRepository.Find(CurrentId);
            data.Delete = false;
            base.Insert(data);
            return data;
        }
        public async Task<EStatusLog> InsertAsync(EStatusLogViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public bool Update(EStatusLogViewModel model, string CurrentId)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Note = model.Note;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;
        }
        public async Task<EStatusLogViewModel> UpdateAsync(EStatusLogViewModel model, string CurrentId)
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
    }
}
