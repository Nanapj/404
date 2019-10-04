using BestApp.Core.Models;
using Repository.Repositories;
using Service;
using Service.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BestApp.Services.CatService;

namespace BestApp.Services
{
    public class CatService : Service<Cat>, ICatService
    {
        public interface ICatService : IService<Cat>
        {
            IQueryable<Cat> GetAllCats();
            Task<IQueryable<Cat>> GetAllCatsAsync();
        }

        private readonly IRepositoryAsync<Cat> _repository;

        public CatService(IRepositoryAsync<Cat> repository) : base(repository)
        {
            _repository = repository;
        }

        public override void Insert(Cat entity)
        {
            // e.g. add business logic here before inserting
            base.Insert(entity);
        }

        public IQueryable<Cat> GetAllCats()
        {
            // add business logic here
            return _repository.Queryable();
        }

        public Task<IQueryable<Cat>> GetAllCatsAsync()
        {
            return Task.Run(() => GetAllCats());
        }

    }
}
