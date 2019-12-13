using BestApp.Core.Models;
using Microsoft.AspNet.OData;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using static BestApp.Services.CatService;

namespace BestApp.Areas.Api.Controllers
{
    public class CatsController : ODataBaseController
    {
        private readonly ICatService _customerService;
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;

        public CatsController(ICatService customerService, IUnitOfWorkAsync unitOfWorkAsync)
        {
            _customerService = customerService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }

        [HttpGet]
        [EnableQuery]
        public async Task<IQueryable<Cat>> Get()
        {
            return await _customerService.GetAllCatsAsync();
        }

    }
}
