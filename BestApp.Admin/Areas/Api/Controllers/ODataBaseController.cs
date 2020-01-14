using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.OData;
using Repository.Pattern;
using System.Data.Entity;
using System.Web;

namespace BestApp.Areas.Api.Controllers
{
    public class ODataBaseController : ODataController
    {
        private readonly string CURRENT_USER_ID;
        private readonly string CURRENT_USER_NAME;

        public ODataBaseController()
        {
            CURRENT_USER_ID = HttpContext.Current.User.Identity.GetUserId();
            CURRENT_USER_NAME = HttpContext.Current.User.Identity.GetUserName();
        }

        protected string GetCurrentUserID()
        {
            return this.CURRENT_USER_ID;
        }

        protected string GetCurrentUserName()
        {
            return this.CURRENT_USER_NAME;
        }
    }
}