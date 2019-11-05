using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.CityService;

namespace BestApp.Areas.Api.Controllers
{
    public class CitiesController : ODataController
    {
        private readonly ICityService _cityService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;

        public CitiesController(ICityService cityService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _cityService = cityService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }

        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<CityViewModel>> Get()
        {
            return await _cityService.GetAllCitysAsync();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(CityViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _cityService.InsertAsync(model);
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