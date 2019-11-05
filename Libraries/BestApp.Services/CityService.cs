using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using Repository.Repositories;
using Service;
using Service.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BestApp.Services.CityService;

namespace BestApp.Services
{
    public class CityService : Service<City>, ICityService
    {
        public interface ICityService : IService<City>
        {
            City Insert(CityViewModel model);
            Task<City> InsertAsync(CityViewModel model);
            Task<IQueryable<CityViewModel>> GetAllCitysAsync();
            IQueryable<City> GetAllCitys();
        }
        private readonly IRepositoryAsync<City> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public CityService(IRepositoryAsync<City> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public IQueryable<City> GetAllCitys()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<CityViewModel>> GetAllCitysAsync()
        {
            return Task.Run(() => GetAllCitys()
            .Select(x => new CityViewModel()
            {
                ID = x.Id,
                name = x.name,
                slug = x.slug,
                type = x.type,
                name_with_type = x.name_with_type,
                code = x.code,
            }));
        }
        public City Insert(CityViewModel model)
        {
            var data = new City();
            data.name = model.name;
            data.slug = model.slug;
            data.type = model.type;
            data.name_with_type = model.name_with_type;
            data.code = model.code;
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            base.Insert(data);
            return data;
           
        }
        public async Task<City> InsertAsync(CityViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
    }
}
