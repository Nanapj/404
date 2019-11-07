using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using static BestApp.Services.StaffService;

namespace BestApp.Areas.Api.Controllers
{
    public class StaffsController : ODataController
    {
        private readonly IStaffService _staffService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;

        public StaffsController(IStaffService staffService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _staffService = staffService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }

        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<StaffViewModel>> Get()
        {
            return await _staffService.GetAllStaffsAsync();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(StaffViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _staffService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                var resultObject = new StaffViewModel()
                {
                    FullName = stf.FullName,
                    Email = stf.Email,
                    ID = stf.Id,
                };
                return Created(resultObject);
            }
            catch (Exception ex)
            {
                
                throw ex;
                
            }
        }
    
        public async Task<IHttpActionResult> Put(StaffViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _staffService.UpdateAsync(model);
                _unitOfWorkAsync.Commit();
                return Updated(model);
            } catch (Exception e)
            {
                throw e;
            }
        }
        public IHttpActionResult Delete(Guid key)
        {
            _staffService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}
