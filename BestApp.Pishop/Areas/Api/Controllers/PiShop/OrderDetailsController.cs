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
using static BestApp.Services.PiShop.OrderDetailService;

namespace BestApp.Areas.Api.Controllers.PiShop
{
    public class OrderDetailsController : ODataBaseController
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public OrderDetailsController(IOrderDetailService orderDetailService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _orderDetailService = orderDetailService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<OrderDetailViewModel>> Get([FromUri] SearchViewModel model)
        {
            return await _orderDetailService.GetOrderDetailsAsync(model);
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(OrderDetailViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _orderDetailService.InsertAsync(model, GetCurrentUserID());
                _unitOfWorkAsync.Commit();
                var resultObject = new OrderDetailViewModel()
                {
                    ID = stf.Id,
                    IsGift = stf.IsGift,
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
        //public async Task<IHttpActionResult> Put(Guid key, OrderDetailViewModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    try
        //    {
        //        await _orderDetailService.UpdateAsync(model, GetCurrentUserID());
        //        _unitOfWorkAsync.Commit();
        //        return Updated(model);
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}
        [HttpDelete]

        public IHttpActionResult Delete(Guid key)
        {
            _orderDetailService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}