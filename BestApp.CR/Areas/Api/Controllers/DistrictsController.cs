﻿using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.DistrictService;

namespace BestApp.Areas.Api.Controllers
{
    public class DistrictsController : ODataController
    {
        private readonly IDistrictService _districtService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;

        public DistrictsController(IDistrictService districtService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _districtService = districtService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }

        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<DistrictViewModel>> Get()
        {
            return await _districtService.GetAllDistrictsAsync();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(DistrictViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _districtService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                var resultObject = new DistrictViewModel()
                {
                    name = model.name,
                    slug = model.slug,
                    type = model.type,
                    name_with_type = model.name_with_type,
                    code = model.code,
                };
                return Created(resultObject);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
    }
}