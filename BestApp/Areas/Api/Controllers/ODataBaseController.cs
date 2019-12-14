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
        private ApplicationUser user;
        private readonly DataContext _context;

        public ODataBaseController(DataContext context)
        {
            _context = context;
        }

        protected ApplicationUser GetCurrentUser()
        {
            var id = HttpContext.Current.User.Identity.GetUserId();
            DbSet t = _context.Set<ApplicationUser>();
            user = (ApplicationUser)t.Find(id);
            return this.user;
        }
    }
}