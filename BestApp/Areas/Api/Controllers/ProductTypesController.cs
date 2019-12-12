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
using static BestApp.Services.ProductTypeService;

namespace BestApp.Areas.Api.Controllers
{
    public class ProductTypesController : ODataController
    {
        private readonly IProductTypeService _productTypeService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public ProductTypesController(IProductTypeService productTypeService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _productTypeService = productTypeService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<ProductTypeViewModel>> Get([FromUri] SearchViewModel model)
        {
            return await _productTypeService.GetAllProductTypesAsync(model);
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(ProductTypeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _productTypeService.InsertAsync(model);
                var resultObject = new ProductTypeViewModel()
                {
                    Name = stf.Name,
                    Code = stf.Code,
                    ID = stf.Id,
                };
                bool de = _unitOfWorkAsync.Commit();
                return Created(resultObject);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, ProductTypeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _productTypeService.UpdateAsync(model);
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
            _productTypeService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}