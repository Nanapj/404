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
using static BestApp.Services.PiShop.OrderStatisticService;

namespace BestApp.Areas.Api.Controllers.PiShop
{
    [Authorize]
    [AuthorizeUser]
    public class OrderStatisticsController : ODataBaseController
    {
        private readonly IOrderStatisticService _orderStatisticService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        // GET: Api/Tags
        public OrderStatisticsController(IOrderStatisticService orderStatisticService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _orderStatisticService = orderStatisticService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<OrderStatisticViewModel>> Get()
        {
            return await _orderStatisticService.GetAllOrderStatisticsAsync();
        }
        [HttpPost]
        public async Task<IHttpActionResult> Post(OrderStatisticViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var stf = await _orderStatisticService.InsertAsync(model, GetCurrentUserID());
                _unitOfWorkAsync.Commit();
                var resultObject = new OrderStatisticViewModel()
                {
                    ID = stf.Id,
                    OrderDetailId = stf.OrderDetailId,
                    OrderId  = stf.OrderId,
                    ProductAttributeId = stf.ProductAttributeId,
                    ProductAttributeName = stf.ProductAttributeName,
                    ProductAttributeNote = stf.ProductAttributeNote,
                    Serial = stf.Serial,
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
        public async Task<IHttpActionResult> Put(Guid key, OrderStatisticViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _orderStatisticService.UpdateAsync(model, GetCurrentUserID());
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
            _orderStatisticService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}