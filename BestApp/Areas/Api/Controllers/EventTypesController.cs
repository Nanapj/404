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
using static BestApp.Services.EventTypeService;

namespace BestApp.Areas.Api.Controllers
{
    public class EventTypesController : ODataController
    {
        private readonly IEventTypeService _eventTypeService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Department
        public EventTypesController(IEventTypeService eventTypeService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _eventTypeService = eventTypeService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<EventTypeViewModel>> Get()
        {
            return await _eventTypeService.GetAllEventTypesAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(EventTypeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _eventTypeService.InsertAsync(model);
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
        public async Task<IHttpActionResult> Put(Guid key, EventTypeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _eventTypeService.UpdateAsync(model);
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
            _eventTypeService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}