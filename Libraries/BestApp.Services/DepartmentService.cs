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
using static BestApp.Services.DepartmentService;

namespace BestApp.Services
{
    public class DepartmentService : Service<Department>, IDepartmentService
    {
        public interface IDepartmentService : IService<Department>
        {
            //IQueryable<Department> GetAllStaffs();
            Department Insert(DepartmentViewModel model);
            //Task<Department> InsertAsync(DepartmentViewModel model);
            //Task<IQueryable<DepartmentViewModel>> GetAllDepartmentsAsync();
            //Task<DepartmentViewModel> UpdateAsync(DepartmentViewModel model);
        }
        private readonly IRepositoryAsync<Department> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public DepartmentService(IRepositoryAsync<Department> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
            
        }
        public Department Insert(DepartmentViewModel model)
        {
            var data = new Department()
            {
                Name = model.Name,
                CreatDate = DateTime.Now,
                Delete = false,
            };
            base.Insert(data);

            return data;
        }
        public Department Update(DepartmentViewModel model)
        {
            var data = Find(model.ID);
            if(data != null)
            {
                data.Name = model.Name;
                
            }
           
            base.Insert(data);

            return data;
        }

    }
}
