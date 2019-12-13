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

        public ODataBaseController()
        {
            CURRENT_USER_ID = HttpContext.Current.User.Identity.GetUserId();
        }

        protected string GetCurrentUser()
        {
            return this.CURRENT_USER_ID;
        }
    }
}