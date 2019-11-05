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
using static BestApp.Services.DetailEventService;

namespace BestApp.Areas.Api.Controllers
{
    public class DetailEventsController : ODataController
    {
        private readonly IDetailEventService _detailEventService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public DetailEventsController(IDetailEventService detailEventService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _detailEventService = detailEventService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<DetailEventViewModel>> Get()
        {
            return await _detailEventService.GetAllDetailEventsAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(DetailEventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _detailEventService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                return Created(model);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, DetailEventViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _detailEventService.UpdateAsync(model);
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
            _detailEventService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}