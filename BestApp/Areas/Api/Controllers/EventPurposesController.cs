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
using static BestApp.Services.EventPurposeService;

namespace BestApp.Areas.Api.Controllers
{
    public class EventPurposesController : ODataController
    {
        private readonly IEventPurposeService _eventPurposeService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Department
        public EventPurposesController(IEventPurposeService eventPurposeService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _eventPurposeService = eventPurposeService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<EventPurposeViewModel>> Get()
        {
            return await _eventPurposeService.GetAllEventPurposesAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(EventPurposeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _eventPurposeService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                var resultObject = new EventPurposeViewModel()
                {
                    ID = stf.Id,
                    Name = stf.Name,

                };
                return Created(resultObject);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, EventPurposeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _eventPurposeService.UpdateAsync(model);
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
            _eventPurposeService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}