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
using static BestApp.Services.InteractionHistoryService;

namespace BestApp.Areas.Api.Controllers
{
    public class InteractionHistorysController : ODataController
    {
        private readonly IInteractionHistoryService _interactionHistoryService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
      
        public InteractionHistorysController(IInteractionHistoryService interactionHistoryService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _interactionHistoryService = interactionHistoryService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<InteractionHistoryViewModel>> Get()
        {
            return await _interactionHistoryService.GetAllInteractionHistorysAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(InteractionHistoryViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _interactionHistoryService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                return Created(model);
            }
            catch (Exception ex)
            {
                _unitOfWorkAsync.Rollback();
                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, InteractionHistoryViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _interactionHistoryService.UpdateAsync(model);
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
            _interactionHistoryService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}