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
using static BestApp.Services.PiShop.TopicPSService;

namespace BestApp.Areas.Api.Controllers.PiShop
{
    public class TopicPSsController : ODataBaseController
    {
        private readonly ITopicPSService _topicPSService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        public TopicPSsController(ITopicPSService topicPSService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _topicPSService = topicPSService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<TopicPSViewModel>> Get()
        {
            var result = await _topicPSService.GetAllTopicPSsAsync();
            return result;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IHttpActionResult> Get([FromODataUri] Guid ID)
        {
            var result =  _topicPSService.GetTopicPSs(ID);
            result.Content = HttpContext.Current.Server.HtmlDecode(result.Content);
            return Ok(result);
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IHttpActionResult> Post(TopicPSViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var stf = await _topicPSService.InsertAsync(model);
                var resultObject = new TopicPSViewModel()
                {
                    ID = stf.Id,
                   BlogPSID = stf.BlogPS.Id,
                   Title = stf.Title
                };
                _unitOfWorkAsync.Commit();
                return Created(resultObject);

            }
            catch (Exception ex)
            {

                throw new Exception(ex.ToString());
            }
        }
        public async Task<IHttpActionResult> Put(TopicPSViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _topicPSService.UpdateAsync(model);
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
            _topicPSService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}