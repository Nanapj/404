﻿using BestApp.Core.Models;
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
using static BestApp.Services.EventTypeService;

namespace BestApp.Services
{
    public class EventTypeService : Service<EventType>, IEventTypeService
    {
        public interface IEventTypeService : IService<EventType>
        {
            EventType Insert(EventTypeViewModel model);
            Task<IQueryable<EventTypeViewModel>> GetAllEventTypesAsync();
            Task<EventType> InsertAsync(EventTypeViewModel model);
            IQueryable<EventTypeViewModel> GetAllEventTypes();
            Task<EventTypeViewModel> UpdateAsync(EventTypeViewModel model);
            bool Delete(Guid Id);
        }
        private readonly IRepositoryAsync<EventType> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public EventTypeService(IRepositoryAsync<EventType> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<EventTypeViewModel> GetAllEventTypes()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new EventTypeViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                EventPurposes = x.EventPurposes.Select(t => new EventPurposeViewModel
                {
                    ID = t.Id,
                    Name = t.Name,
                }).ToList()

            });
        }
        public Task<IQueryable<EventTypeViewModel>> GetAllEventTypesAsync()
        {
            return Task.Run(() => GetAllEventTypes());
        }
        public EventType Insert(EventTypeViewModel model)
        {
            var find = Queryable().Where(x => x.Name == model.Name && x.Delete == false).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Loại sự kiện đã tồn tại");
            }
            else
            {
                var data = new EventType();
                data.Name = model.Name;
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.LastModifiedDate = DateTime.Now;
                //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
                base.Insert(data);
                return data;
            }
        }
        public async Task<EventType> InsertAsync(EventTypeViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public bool Update(EventTypeViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<EventTypeViewModel> UpdateAsync(EventTypeViewModel model)
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
                if (result.EventPurposes.Any())
                {
                    throw new Exception("Không được phép xóa do sự kiện có mục đích");
                }
                else
                {
                    result.Delete = true;
                    result.LastModifiedDate = DateTime.Now;
                    return true;
                }

            }
            else
            {
                throw new Exception("Không tìm thấy sự kiện");
            }
        }
    }
}