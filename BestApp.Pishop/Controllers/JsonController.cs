using BestApp.Core.Models;
using BestApp.Domain;
using BestApp.Domain.PiShop;
using BestApp.Services;
using BestApp.Services.PiShop;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using Repository.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BestApp.Controllers
{
    public class JsonController : Controller
    {
        private readonly IUnitOfWorkAsync _unitOfWorkAsync;
        private readonly OrderService _orderService;
        private readonly EventService _eventService;

       
        public JsonController(OrderService orderService,
            EventService eventService,
            IUnitOfWorkAsync unitOfWorkAsync)
        {
           
            _orderService = orderService;
            _eventService = eventService;
            _unitOfWorkAsync = unitOfWorkAsync;
        }

        public ActionResult UpdateStatusOrder(OrderViewModel model)
        {
            
            var r = _orderService.UpdateStatus(model);
            _unitOfWorkAsync.SaveChanges();
            return Json(r, JsonRequestBehavior.AllowGet);

        }
        public ActionResult UpdateStatusEvent(Guid Id)
        {
            var CurrentId = HttpContext.User.Identity.GetUserId();
            var r = _eventService.UpdateStatusSeen(Id, CurrentId);
            _unitOfWorkAsync.SaveChanges();
            return Json(r, JsonRequestBehavior.AllowGet);

        }
    }
   
}