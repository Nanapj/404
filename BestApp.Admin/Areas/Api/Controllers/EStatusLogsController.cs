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
using static BestApp.Services.EStatusLogService;

namespace BestApp.Areas.Api.Controllers
{
    public class EStatusLogsController : ODataBaseController
    {
        private readonly IEStatusLogService _eStatusLogService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public EStatusLogsController(IEStatusLogService eStatusLogService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _eStatusLogService = eStatusLogService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<EStatusLogViewModel>> Get([FromUri] SearchViewModel model)
        {
            var result = await _eStatusLogService.GetAllEStatusLogsAsync(model);
            return result;
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(EStatusLogViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _eStatusLogService.InsertAsync(model, GetCurrentUserID());
                _unitOfWorkAsync.Commit();
                var resultObject = new EStatusLogViewModel()
                {
                    Status = stf.Status,
                    Note = stf.Note,
                    ID = stf.Id,
                    CreatDate = stf.CreatDate
                };
                return Created(resultObject);

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, EStatusLogViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _eStatusLogService.UpdateAsync(model, GetCurrentUserID());
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
            _eStatusLogService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}