using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BestApp.Controllers
{
    public class TopicController : Controller
    {
        // GET: Topic
        public ActionResult Index()
        {
            return PartialView();
        }
        public ActionResult Create()
        {
            return PartialView();
        }
        public ActionResult Edit()
        {
            return PartialView();
        }
    }
}