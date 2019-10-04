using Repository.Repositories;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Repository.UnitOfWork
{
    public interface IUnitOfWorkAsync : IUnitOfWork
    {
        Task<int> SaveChangesAsync();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        IUnitOfWorkAsync NewUnitOfWorkAsync();
        IRepositoryAsync<TEntity> RepositoryAsync<TEntity>() where TEntity : class;
        Task<int> ExecuteSqlCommandAsync(string sql, params object[] parameters);
        Task<int> ExecuteSqlCommandAsync(string sql, CancellationToken cancellationToken, params object[] parameters);
    }
}