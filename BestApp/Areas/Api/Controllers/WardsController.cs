using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.WardService;

namespace BestApp.Areas.Api.Controllers
{
    public class WardsController : ODataController
    {
        private readonly IWardService _wardService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;

        public WardsController(IWardService wardService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _wardService = wardService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }

        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<WardViewModel>> Get()
        {
            return await _wardService.GetAllWardsAsync();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(WardViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _wardService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                return Created(model);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
    }
}