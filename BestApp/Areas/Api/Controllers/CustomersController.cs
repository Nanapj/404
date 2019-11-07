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
using static BestApp.Services.CustomerService;

namespace BestApp.Areas.Api.Controllers
{
    public class CustomersController : ODataController
    {
        private readonly ICustomerService _customerService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public CustomersController(ICustomerService customerService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _customerService = customerService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<CustomerViewModel>> Get([FromUri] SearchViewModel model)
        {
            return await _customerService.GetAllCustomersAsync(model);
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(CustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _customerService.InsertAsync(model);
                _unitOfWorkAsync.Commit();
                var resultObject = new CustomerViewModel()
                {
                   ID = stf.Id,
                   Name = stf.Name,
                   PhoneNumber = stf.PhoneNumber,
                   Birthday = stf.Birthday,
                   Address = stf.Address,
                   Ward = stf.Ward,
                   District = stf.District,
                   City = stf.City,
                   Note = stf.Note,
                   CreatDate = DateTime.Now,
                   LastModifiedDate = DateTime.Now
                };
                return Created(resultObject);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, CustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _customerService.UpdateAsync(model);
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
            _customerService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}