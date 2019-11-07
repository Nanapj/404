using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.ReminderNoteService;

namespace BestApp.Areas.Api.Controllers
{
    public class ReminderNotesController : ODataController
    {
        private readonly IReminderNoteService _reminderNoteService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public ReminderNotesController(IReminderNoteService reminderNoteService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _reminderNoteService = reminderNoteService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<ReminderNoteViewModel>> Get()
        {
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
                var stf = await _reminderNoteService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                var resultObject = new ReminderNoteViewModel()
                {
                    Note = stf.Note,
                    ReminderDate = stf.ReminderDate,
                    ID = stf.Id,
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