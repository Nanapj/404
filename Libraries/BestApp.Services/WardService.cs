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
using static BestApp.Services.WardService;

namespace BestApp.Services
{
    public class WardService : Service<Ward>, IWardService
    {
        public interface IWardService : IService<Ward>
        {
            Ward Insert(WardViewModel model);
            Task<Ward> InsertAsync(WardViewModel model);
            Task<IQueryable<WardViewModel>> GetAllWardsAsync();
            IQueryable<Ward> GetAllWards();
        }
        private readonly IRepositoryAsync<Ward> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public WardService(IRepositoryAsync<Ward> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public IQueryable<Ward> GetAllWards()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<WardViewModel>> GetAllWardsAsync()
        {
            return Task.Run(() => GetAllWards()
            .Select(x => new WardViewModel()
            {
                ID = x.Id,
                name = x.name,
                slug = x.slug,
                type = x.type,
                path = x.path,
                path_with_type = x.path_with_type,
                parent_code = x.parent_code,
                name_with_type = x.name_with_type,
                code = x.code,
            }));
        }
        public Ward Insert(WardViewModel model)
        {
            var data = new Ward();
            data.name = model.name;
            data.slug = model.slug;
            data.parent_code = model.parent_code;
            data.path = model.path;
            data.type = model.type;
            data.path_with_type = model.path_with_type;
            data.name_with_type = model.name_with_type;
            data.code = model.code;
            data.CreatDate = DateTime.Now;
            data.Delete = false;
            data.LastModifiedDate = DateTime.Now;
            base.Insert(data);
            return data;

        }
        public async Task<Ward> InsertAsync(WardViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
    }
}
