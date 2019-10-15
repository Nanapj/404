﻿using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

using static BestApp.Services.DepartmentService;

namespace BestApp.Areas.Api.Controllers
{
    public class DepartmentsController : ODataController
    {
        private readonly IDepartmentService _departmentService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Department
        public DepartmentsController(IDepartmentService departmenService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _departmentService = departmenService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<DepartmentViewModel>> Get()
        {
            return await _departmentService.GetAllDepartmentsAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(DepartmentViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _departmentService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                return Created(model);
            }
            catch (Exception ex)
            {
                _unitOfWorkAsync.Rollback();
                throw ex;
            }
        }
    }
}