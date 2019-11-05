using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
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
            builder.EntitySet<InteractionHistoryViewModel>("InteractionHistorys");
            builder.EntitySet<EventViewModel>("Events");
            builder.EntitySet<ProductTypeViewModel>("ProductTypes");
            builder.EntitySet<WardViewModel>("Wards");
            builder.EntitySet<CityViewModel>("Cities");
            builder.EntitySet<DistrictViewModel>("Districts");

            // Web API routes
            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
