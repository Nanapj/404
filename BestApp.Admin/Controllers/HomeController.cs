using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BestApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult app()
        {
            return PartialView();
        }

        public ActionResult dashboard()
        {
            return PartialView();
        }

        public ActionResult header()
        {
            return PartialView();
        }

        public ActionResult aside()
        {
            return PartialView();
        }

        public ActionResult settings()
        {
            return PartialView();
        }

        public ActionResult nav()
        {
            return PartialView();
        }
    }
}