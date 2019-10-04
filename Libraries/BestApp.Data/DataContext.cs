using BestApp.Core.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Repository.Pattern
{
    public class DataContext : IdentityDbContext<ApplicationUser>
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