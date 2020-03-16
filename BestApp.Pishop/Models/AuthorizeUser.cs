using BestApp.Core.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace BestApp.Models
{
    public class AuthorizeUser : ActionFilterAttribute
    {
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public AuthorizeUser()
        {
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            base.OnActionExecuted(actionExecutedContext);
        }
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
           ApplicationUser user = userManager.FindById(HttpContext.Current.User.Identity.GetUserId());

            if (user.Roles.ToString().ToLower().Trim() != "admin" && user.Roles.ToString().ToLower().Trim() != "manager" && user.Roles.ToString().ToLower().Trim() != "account")
            {
                var Path = HttpContext.Current.Request.Url.AbsolutePath;
                switch (Path)
                {
                    default:
                        Console.WriteLine("Ok case");
                        break;
                }
            }
            base.OnActionExecuting(actionContext);
        }

    }
}