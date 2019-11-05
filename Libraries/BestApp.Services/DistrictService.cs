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
using static BestApp.Services.DistrictService;

namespace BestApp.Services
{
    public class DistrictService : Service<District>, IDistrictService
    {
        public interface IDistrictService : IService<District>
        {
            District Insert(DistrictViewModel model);
            Task<District> InsertAsync(DistrictViewModel model);
            Task<IQueryable<DistrictViewModel>> GetAllDistrictsAsync();
            IQueryable<District> GetAllDistricts();
        }
        private readonly IRepositoryAsync<District> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public DistrictService(IRepositoryAsync<District> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public IQueryable<District> GetAllDistricts()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<DistrictViewModel>> GetAllDistrictsAsync()
        {
            return Task.Run(() => GetAllDistricts()
            .Select(x => new DistrictViewModel()
            {
                name = x.name,
                slug = x.slug,
                type = x.type,
                name_with_type = x.name_with_type,
                code = x.code,
                path = x.path,
                path_with_type = x.path_with_type,
                parent_code = x.parent_code,
            }));
        }
        public District Insert(DistrictViewModel model)
        {
            
            var data = new District();
            data.name = model.name;
            data.slug = model.slug;
            data.type = model.type;
            data.name_with_type = model.name_with_type;
            data.code = model.code;
            data.path = model.path;
            data.path_with_type = model.path_with_type;
            data.parent_code = model.parent_code;
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            base.Insert(data);
            return data;

        }
        public async Task<District> InsertAsync(DistrictViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
    }
}
