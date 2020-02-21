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
using static BestApp.Services.PiShop.BlogPSService;

namespace BestApp.Areas.Api.Controllers.PiShop
{
    public class BlogPSsController : ODataBaseController
    {
        private readonly IBlogPSService _blogPSService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        public BlogPSsController(IBlogPSService blogPSService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _blogPSService = blogPSService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }
        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<BlogPSViewModel>> Get()
        {
            var result = await _blogPSService.GetAllBlogPSsAsync();
            return result;
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IHttpActionResult> Post(BlogPSViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var stf = await _blogPSService.InsertAsync(model);
                var resultObject = new BlogPSViewModel()
                {
                    ID = stf.Id,
                    Category = stf.Category,
                    Note = stf.Note,
                };
                _unitOfWorkAsync.Commit();
                return Created(resultObject);

            }
            catch (Exception ex)
            {

                throw new Exception(ex.ToString());
            }
        }
        public async Task<IHttpActionResult> Put(BlogPSViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _blogPSService.UpdateAsync(model);
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
            _blogPSService.Delete(key);
            _unitOfWorkAsync.Commit();
            return StatusCode(HttpStatusCode.OK);

        }
    }
}