using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BestApp.Controllers
{
    public class CrEventController : Controller
    {
        // GET: CrEvent
        public ActionResult Index()
        {
            return PartialView();
        }

        public ActionResult EventCreation()
        {
            return PartialView();
        }
    }
}