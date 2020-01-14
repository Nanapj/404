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
    public class OdataFilter : ActionFilterAttribute, IActionFilter
    {
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public OdataFilter()
        {
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            //var URI = actionContext.RequestContext.Url.Request.RequestUri.AbsolutePath.ToString();
            //var Method = actionContext.Request.Method.ToString();
            //var UserRole = HttpContext.Current.User.IsInRole("Admin");
            //var ManagerRole = HttpContext.Current.User.IsInRole("Manager");
            //var Contain = URI.Contains("Note") || URI.Contains("DebtNote");
            //if (UserRole == false && ManagerRole == false)
            //{
            //    switch (URI)
            //    {
            //        case "/odata/InteractionHistory":
            //            {
            //                if (Method == "PUT" || Method == "DELETE")
            //                {
            //                    throw new HttpException("Ban khong co quyen truy cap");
            //                }
            //                break;
            //            }
            //        case "/odata/DebtNote":
            //            {
            //                if (Method == "PUT" || Method == "DELETE")
            //                {
            //                    throw new HttpException("Ban khong co quyen truy cap");
            //                }
            //                break;
            //            }
            //        default:
            //            break;
            //    }
            //    if (Contain)
            //    {
            //        if (URI.Contains("Note") || URI.Contains("DebtNote"))
            //        {
            //            if (Method == "PUT" || Method == "DELETE")
            //            {
            //                throw new HttpException("Ban khong co quyen truy cap");
            //            }
            //        }
            //    }
            //}

            //base.OnActionExecuting(actionContext);
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            base.OnActionExecuted(actionExecutedContext);
        }
    }
}