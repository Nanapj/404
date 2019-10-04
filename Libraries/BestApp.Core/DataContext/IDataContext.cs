using System;

namespace Repository.DataContext
{
    public interface IDataContext : IDisposable
    {
        int SaveChanges();
        void SyncObjectState<TEntity>(TEntity entity) where TEntity : class;
        void SyncObjectsStatePostCommit();
    }
}