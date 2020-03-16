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
using static BestApp.Services.EventService;

namespace BestApp.Areas.Api.Controllers
{
    public class EventsController : ODataBaseController
    {
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
        public async Task<IQueryable<EventViewModel>> Get([FromUri] SearchViewModel model)
        {
            var result = await _eventService.GetAllEventsAsync(model);
            return result;
        }
        [EnableQuery]
        public IEnumerable<EventViewModel> GetEventByCustomer([FromUri] SearchViewModel model)
        {
            var result =  _eventService.GetEventByCustomer(model);
            return result;
        }
        [EnableQuery]
        public Task<IQueryable<EventViewModel>> GetEventForPishop([FromUri] SearchViewModel model)
        {
            var result = _eventService.GetEventForPishopAsync(model);
            return result;
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IHttpActionResult> Post(EventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var stf = await _eventService.InsertAsync(model, GetCurrentUserID());           
                var resultObject = new EventViewModel()
                {
                    Code = stf.Code,
                    Status = stf.Status,
                    CustomerID = stf.Customer.Id,
                    CustomerName = stf.Customer.Name,
                    Note = stf.Note,
                    ID = stf.Id,
                    EventTypeID = stf.EventTypeId,
                    EventPurposeID = stf.EventPurposeId,
                    Birthday = stf.Customer.Birthday
                };
                _unitOfWorkAsync.Commit();
                return Created(resultObject);
               
            }
            catch (Exception ex)
            {

                throw new Exception(ex.ToString());
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
                await _eventService.UpdateAsync(model, GetCurrentUserID());
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