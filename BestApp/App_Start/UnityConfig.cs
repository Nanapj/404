using BestApp.Areas.Api.Controllers;
using BestApp.Controllers;
using BestApp.Core.Models;
using BestApp.Models;
using BestApp.Services;
using Microsoft.AspNet.Identity;
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
using static BestApp.Services.CustomerService;
using static BestApp.Services.DepartmentService;
using static BestApp.Services.DetailEventService;
using static BestApp.Services.EventService;
using static BestApp.Services.InteractionHistoryService;
using static BestApp.Services.ProductTypeService;
using static BestApp.Services.ReminderNoteService;
using static BestApp.Services.StaffService;
using static BestApp.Services.TagService;

namespace BestApp
{
    public static class UnityConfig
    {
        private static Lazy<IUnityContainer> container =
            new Lazy<IUnityContainer>(() =>
            {
                var container = new UnityContainer();
                RegisterTypes(container);
                return container;
            });

        public static IUnityContainer Container => container.Value;

        public static void RegisterTypes(IUnityContainer container)
        {
            container
            .RegisterType<DbContext, DataContext>(new HierarchicalLifetimeManager())
            .RegisterType(typeof(IRepositoryAsync<>), typeof(Repository<>))
            .RegisterType<IUnitOfWorkAsync, UnitOfWork>(new HierarchicalLifetimeManager())

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

            .RegisterType<UserManager<ApplicationUser>>(new HierarchicalLifetimeManager())
            .RegisterType<AccountController>(new InjectionConstructor())
            .RegisterType<ManageController>(new InjectionConstructor());

        }
    }
}