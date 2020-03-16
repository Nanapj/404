using BestApp.Domain;
using BestApp.Domain.PiShop;
using BestApp.Models;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static BestApp.Services.PiShop.OrderService;

namespace BestApp.Areas.Api.Controllers.PiShop
{
    [Authorize]
    [AuthorizeUser]
    public class OrdersController : ODataBaseController
    {
        private readonly IOrderService _orderService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public OrdersController(IOrderService orderService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _orderService = orderService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<OrderViewModel>> Get([FromUri] SearchViewModel model)
        {
            return await _orderService.GetAllOrdersAsync(model);
        }
        [HttpGet]
        [EnableQuery]
        public IEnumerable<OrderViewModel> GetOrderByPhoneNumber([FromUri] SearchViewModel model)
        {
            var result = _orderService.GetOrderByPhoneNumber(model);
            return result;
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(OrderViewModel model)
            {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _orderService.InsertAsync(model, GetCurrentUserID());
                _unitOfWorkAsync.Commit();
                var resultObject = new OrderViewModel()
                {
                    ID = stf.Id,
                    Code = stf.Code,
                    Total = stf.Total,
                    IsGift = stf.IsGift,
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
        public async Task<IHttpActionResult> Put(Guid key, OrderViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _orderService.UpdateAsync(model, GetCurrentUserID());
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
            _orderService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}