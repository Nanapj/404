using BestApp.Core.Models;
using BestApp.Core.Models.PiShop;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.DataContext;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Repository.Pattern
{
    public class DataContext : IdentityDbContext<ApplicationUser>, IDataContext
    {
        private readonly Guid _instanceId;

        public DataContext() : base("DefaultConnection", throwIfV1Schema: false)
        {
            _instanceId = Guid.NewGuid();
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
        }

        public Guid InstanceId => _instanceId;

        public DbSet<Cat> Cats { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerTag> CustomerTags { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<DetailEvent> Detailevents { get; set; }
        public DbSet<InteractionHistory> InteractionHistories { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<ReminderNote> ReminderNotes { get; set; }
        public DbSet<City> Citys { get; set; }
        public DbSet<Ward> Wards { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<EventPurpose> EventPurposes { get; set; }
        public DbSet<EventType> EventTypes { get; set; }
        public DbSet<EStatusLog> EStatusLogs { get; set; }
        public DbSet<TopicPS> TopicPSs { get; set; }
        public DbSet<BlogPS> BlogPSs { get; set; }
        public override int SaveChanges()
        {
            var changes = base.SaveChanges();
            return changes;
        }

        public static DataContext Create()
        {
            return new DataContext();
        }

        public override async Task<int> SaveChangesAsync()
        {
            return await SaveChangesAsync(CancellationToken.None);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            var changesAsync = await base.SaveChangesAsync(cancellationToken);
            return changesAsync;
        }
    }
}