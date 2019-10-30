﻿using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.EventService;

namespace BestApp.Areas.Api
{
    public class EventsController : ODataController
    {
        // GET: Api/Events
        private readonly IEventService _eventService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public EventsController(IEventService eventService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _eventService = eventService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<EventViewModel>> Get()
        {
            return await _eventService.GetAllEventsAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(EventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _eventService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                return Created(model);
            }
            catch (Exception ex)
            {
                _unitOfWorkAsync.Rollback();
                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, EventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _eventService.UpdateAsync(model);
                _unitOfWorkAsync.Commit();
                return Updated(model);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        [HttpDelete]

        public IHttpActionResult Delete(Guid key)
        {
            _eventService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}