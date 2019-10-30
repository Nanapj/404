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
            Task<IQueryable<EventViewModel>> GetAllEventsAsync();
            IQueryable<Event> GetAllEvents();
            bool Delete(Guid Id);
        }
        private readonly TagService _tagService;
        private readonly CustomerService _customerService;
        private readonly IRepositoryAsync<Event> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public EventService(IRepositoryAsync<Event> repository,
             TagService tagService,
             CustomerService customerService) : base(repository)
        {
            _tagService = tagService;
            _customerService = customerService;var 
            _repository = repository;
           db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<Event> GetAllEvents()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<EventViewModel>> GetAllEventsAsync()
        {
            return Task.Run(() => GetAllEvents().Select(x => new EventViewModel()
            {
                ID = x.Id,
                Code = x.Code,
                CreatDate = x.CreatDate,
                CustomerID = x.Customer.Id,
                CustomerName = x.Customer.Name,
                Address = x.Customer.Address,
                PhoneNumber = x.Customer.PhoneNumber,
                TypeEvent = x.TypeEvent,
                Status = x.Status,
                Tags = x.Tags.Select(t => new TagViewModel()
                {
                    ID = t.Id,
                    NameTag = t.NameTag,
                    CodeTag = t.CodeTag,
                }).ToList(),
                DetailEvents = x.DetailEvents.Select(t=> new DetailEventViewModel()
                {
                    ID = t.Id,
                    Serial = t.Serial,
                    Note = t.Note
                }).ToList(),
                InteractionHistorys = x.InteractionHistorys.Select(t=> new InteractionHistoryViewModel()
                {
                    Type = t.Type,
                    Note = t.Note,
                    EmployeeCall = t.EmployeeCall,
                    EmployeeID = t.EmployeeID
                }).ToList()
             }));
        }
        public Event Insert(EventViewModel model)
        {
            var find = Queryable().Where(x => x.Code == model.Code).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Số phiếu đã tồn tại");
            }
            else
            {
                var data = new Event();
                 
                data.Code = model.Code;
                data.Customer = _customerService.Find(model.CustomerID);
                data.Status = model.Status;
                data.EmployeeID = model.CustomerID;
                data.TypeEvent = model.TypeEvent;
                if(model.DetailEvents != null)
                {
                    foreach (var item in model.DetailEvents)
                    {
                        data.DetailEvents.Add(new DetailEvent()
                        {
                            Serial = item.Serial,
                            Note = item.Note
                        });
                    }
                }
                foreach(var item in model.Tags)
                {
                    var t = _tagService.Find(item.ID);
                    if (t != null)
                    {
                        data.Tags.Add(t);
                    }
                }
                if(model.ReminderNotes != null)
                {
                    foreach(var item in model.ReminderNotes)
                    {
                        data.ReminderNotes.Add(new ReminderNote()
                        {
                            ReminderDate = item.ReminderDate,
                            CreatDate = DateTime.Now,
                            LastModifiedDate = DateTime.Now,
                            Note = item.Note,
                        });
                    }
                }
                if(model.InteractionHistorys != null)
                {
                    foreach (var item in model.InteractionHistorys)
                    {
                        data.InteractionHistorys.Add(new InteractionHistory()
                        {
                            Type = item.Type,
                            Note = item.Note,
                            EmployeeCall = item.EmployeeCall,
                            EmployeeID = item.EmployeeID
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
                data.TypeEvent = model.TypeEvent;
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