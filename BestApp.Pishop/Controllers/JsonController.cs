using BestApp.Core.Models;
using BestApp.Domain;
using BestApp.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BestApp.Controllers
{
    public class JsonController : Controller
    {
        private readonly DepartmentService _departmentService;
        private readonly TagService _tagService;
        private readonly EventService _eventService;
        private readonly DetailEventService _detailEventService;
        private readonly InteractionHistoryService _interactionHistoryService;
        private readonly CustomerService _customerService;
        private readonly DataContext db;
        private UserManager<ApplicationUser> userManager;
        public JsonController(
           DepartmentService departmentService,
           TagService tagService,
           EventService eventService,
           DetailEventService detailEventService,
           InteractionHistoryService interactionHistoryService,
           CustomerService customerService
           )
        {
            _departmentService = departmentService;
            _tagService = tagService;
            _eventService = eventService;
            _detailEventService = detailEventService;
            _interactionHistoryService = interactionHistoryService;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
       
        //public ActionResult GetInteractionHistoryByCustomer(SearchViewModel model)
        //{

        //}
    }
   
}