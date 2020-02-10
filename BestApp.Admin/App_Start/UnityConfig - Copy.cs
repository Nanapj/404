using BestApp.Controllers;
using BestApp.Core.Models;
using BestApp.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.DataContext;
using Repository.Pattern;
using Repository.Repositories;
using Repository.UnitOfWork;
using System;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using Unity;
using Unity.AspNet.Mvc;
using Unity.Injection;
using Unity.Lifetime;
using static BestApp.Services.CatService;
using static BestApp.Services.CityService;
using static BestApp.Services.CustomerService;
using static BestApp.Services.DepartmentService;
using static BestApp.Services.DetailEventService;
using static BestApp.Services.DistrictService;
using static BestApp.Services.EventPurposeService;
using static BestApp.Services.EventService;
using static BestApp.Services.EventTypeService;
using static BestApp.Services.InteractionHistoryService;
using static BestApp.Services.ProductTypeService;
using static BestApp.Services.ReminderNoteService;
using static BestApp.Services.StaffService;
using static BestApp.Services.TagService;
using static BestApp.Services.WardService;

namespace BestApp
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            var container = new UnityContainer();

            container
            .RegisterType<DbContext, DataContext>(new HierarchicalLifetimeManager())
            .RegisterType(typeof(IRepositoryAsync<>), typeof(Repository<>))
            .RegisterType(typeof(IRepository<>), typeof(Repository<>))
            .RegisterType<IUnitOfWorkAsync, UnitOfWork>(new HierarchicalLifetimeManager())
            .RegisterType<IDataContext, DataContext>(new HierarchicalLifetimeManager())

            // Custom services
            .RegisterType<ICatService, CatService>()
            .RegisterType<IStaffService, StaffService>()
            .RegisterType<IDepartmentService, DepartmentService>()
            .RegisterType<ITagService, TagService>()
            .RegisterType<ICustomerService, CustomerService>()
            .RegisterType<IEventService, EventService>()
            .RegisterType<IDetailEventService, DetailEventService>()
            .RegisterType<IProductTypeService, ProductTypeService>()
            .RegisterType<IReminderNoteService, ReminderNoteService>()
            .RegisterType<IInteractionHistoryService, InteractionHistoryService>()
            .RegisterType<IDistrictService, DistrictService>()
            .RegisterType<IWardService, WardService>()
            .RegisterType<ICityService, CityService>()
            .RegisterType<IEventTypeService, EventTypeService>()
            .RegisterType<IEventPurposeService, EventPurposeService>()
            .RegisterType<UserManager<ApplicationUser>>(new HierarchicalLifetimeManager())
            .RegisterType<AccountController>(new InjectionConstructor())
            .RegisterType<ApplicationUserManager>(new HierarchicalLifetimeManager())
            .RegisterType<IUserStore<ApplicationUser>, UserStore<ApplicationUser>>(new HierarchicalLifetimeManager())
            .RegisterType<ManageController>(new InjectionConstructor());

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);

        }
    }
}