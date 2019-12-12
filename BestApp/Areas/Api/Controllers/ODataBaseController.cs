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
        private readonly ApplicationUser user;

        public ODataBaseController()
        {
            var id = HttpContext.Current.User.Identity.GetUserId();
            DataContext d = new DataContext();
            DbSet t = d.Set<ApplicationUser>();
            user = (ApplicationUser)t.Find(id);
        }

        protected ApplicationUser GetCurrentUser()
        {
            return this.user;
        }
    }
}