﻿using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.OData;
using Repository.Pattern;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.ReminderNoteService;

namespace BestApp.Areas.Api.Controllers
{
    public class ReminderNotesController : ODataBaseController
    {
        private readonly IReminderNoteService _reminderNoteService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        private readonly DataContext _context;

        public ReminderNotesController(DataContext context, IReminderNoteService reminderNoteService,
            IUnitOfWorkAsync unitOfWorkAsync) : base(context)
        {
            _reminderNoteService = reminderNoteService;
            _unitOfWorkAsync = unitOfWorkAsync;
            _context = context;
        }

        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<ReminderNoteViewModel>> Get()
        {
            //ApplicationUser test = GetCurrentUser();
            return await _reminderNoteService.GetAllReminderNotesAsync();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(ReminderNoteViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var test = GetCurrentUser();
                model.UserAccount = test;
                var stf = await _reminderNoteService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                var resultObject = new ReminderNoteViewModel()
                {
                    Note = stf.Note,
                    ReminderDate = stf.ReminderDate,
                    ID = stf.Id,
                    Serial = stf.Serial
                };
                return Created(resultObject);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, ReminderNoteViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _reminderNoteService.UpdateAsync(model);
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
            _reminderNoteService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}