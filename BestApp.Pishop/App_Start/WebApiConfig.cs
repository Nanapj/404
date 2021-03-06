﻿using BestApp.Core.Models;
using BestApp.Domain;
using BestApp.Domain.PiShop;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.OData.Edm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using static BestApp.Areas.Api.Controllers.CatsController;

namespace BestApp
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            var builder = new ODataConventionModelBuilder();
            config.Count().Filter().OrderBy().Expand().Select().MaxTop(null);

            builder.EntitySet<Cat>("Cats"); //test
            builder.EntitySet<StaffViewModel>("Staffs");
            builder.EntitySet<DepartmentViewModel>("Departments");
            builder.EntitySet<TagViewModel>("Tags");
            builder.EntitySet<CustomerViewModel>("Customers");
            builder.EntitySet<ReminderNoteViewModel>("ReminderNotes");
            builder.EntitySet<DetailEventViewModel>("DetailEvents");
            builder.EntitySet<InteractionHistoryViewModel>("InteractionHistories");
            builder.EntityType<InteractionHistoryViewModel>()
                .Collection
                .Function("GetInteractionHistoryByCustomer")
                .ReturnsCollectionFromEntitySet<InteractionHistoryViewModel>("InteractionHistories");
            builder.EntitySet<EventViewModel>("Events");
            builder.EntityType<EventViewModel>()
                .Collection
                .Function("GetEventByCustomer")
                .ReturnsCollectionFromEntitySet<EventViewModel>("Events");
            builder.EntityType<EventViewModel>()
                .Collection
                .Function("GetEventForPishop")
                .ReturnsCollectionFromEntitySet<EventViewModel>("Events");
            builder.EntitySet<ProductTypeViewModel>("ProductTypes");
            builder.EntitySet<WardViewModel>("Wards");
            builder.EntitySet<CityViewModel>("Cities");
            builder.EntitySet<DistrictViewModel>("Districts");
            builder.EntitySet<EventPurposeViewModel>("EventPurposes");
            builder.EntitySet<EventTypeViewModel>("EventTypes");
            builder.EntitySet<EStatusLogViewModel>("EStatusLogs");
            builder.EntitySet<TopicPSViewModel>("TopicPSs");
            builder.EntitySet<BlogPSViewModel>("BlogPSs");
            builder.EntitySet<ProductAttributeViewModel>("ProductAttributes");
            builder.EntityType<ProductAttributeViewModel>()
               .Collection
               .Function("GetProductAttributesByP")
               .ReturnsCollectionFromEntitySet<OrderViewModel>("Orders");
            builder.EntitySet<OrderViewModel>("Orders");
            builder.EntityType<OrderViewModel>()
               .Collection
               .Function("GetOrderByPhoneNumber")
               .ReturnsCollectionFromEntitySet<OrderViewModel>("Orders");
            builder.EntitySet<OrderDetailViewModel>("OrderDetails");
            builder.EntitySet<OrderStatisticViewModel>("OrderStatistics");
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            IEdmModel model = builder.GetEdmModel();
            // Web API routes
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            config.MapODataServiceRoute("odata", "odata", model);

           
        }
    }
}
