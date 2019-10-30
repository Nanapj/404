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
        private readonly DataContext db;
        private UserManager<ApplicationUser> userManager;
        public JsonController(
           DepartmentService departmentService,
           TagService tagService
           )
        {
            _departmentService = departmentService;
            _tagService = tagService;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        //public ActionResult GetTagByDepartment(SearchTagByDepartmentViewmodel model)
        //{
            
        //}
    }
   
}