using BestApp.Domain;
using BestApp.Domain.PiShop;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.PiShop.ProductAttributeService;

namespace BestApp.Areas.Api.Controllers.PiShop
{
    public class ProductAttributesController : ODataBaseController
    {
        private readonly IProductAttributeService _productAttributeService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public ProductAttributesController(IProductAttributeService productAttributeService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _productAttributeService = productAttributeService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<ProductAttributeViewModel>> Get()
        {
            return await _productAttributeService.GetAllProductAttributesAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(ProductAttributeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _productAttributeService.InsertAsync(model, GetCurrentUserID());
                _unitOfWorkAsync.Commit();
                var resultObject = new ProductAttributeViewModel()
                {
                    ID = stf.Id,
                    Name = stf.Name,
                    ProductName = stf.ProductType.Name,
                    ProductCode = stf.ProductType.Code
                   
                };
                return Created(resultObject);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public async Task<IHttpActionResult> Put(Guid key, ProductAttributeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _productAttributeService.UpdateAsync(model);
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
            _productAttributeService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}