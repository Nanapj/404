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
using System.Web;
using static BestApp.Services.DepartmentService;

namespace BestApp.Services
{
    public class DepartmentService : Service<Department>, IDepartmentService
    {
        public interface IDepartmentService : IService<Department>
        {
            //IQueryable<Department> GetAllStaffs();
            Department Insert(DepartmentViewModel model, string CurrentId);
            Task<IQueryable<DepartmentViewModel>> GetAllDepartmentsAsync();
            Task<Department> InsertAsync(DepartmentViewModel model, string CurrentId);
            IQueryable<DepartmentViewModel> GetAllDepartments();
            Task<DepartmentViewModel> UpdateAsync(DepartmentViewModel model);
            bool Delete(Guid Id);

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
        public IQueryable<DepartmentViewModel> GetAllDepartments()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new DepartmentViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                Tags = x.Tags.Where(t => t.Status == Core.Enum.StatusTag.New).Select(t => new TagViewModel()
                {
                    NameTag = t.NameTag,
                    CodeTag = t.CodeTag,

                }).ToList()
            });
        }
        public Task<IQueryable<DepartmentViewModel>> GetAllDepartmentsAsync()
        {
            return Task.Run(() => GetAllDepartments());
        }
        public Department Insert(DepartmentViewModel model, string CurrentId)
        {
            var find = Queryable().Where(x => x.Name == model.Name).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Phòng ban đã tồn tại");
            }
            else
            {
                var data = new Department();

                data.Name = model.Name;
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.LastModifiedDate = DateTime.Now;
                data.UserAccount = _userRepository.Find(CurrentId);
                //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());


                base.Insert(data);
                return data;
            }

        }
        public bool Update(DepartmentViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<DepartmentViewModel> UpdateAsync(DepartmentViewModel model)
        {
            try
            {
                await Task.Run(() => Update(model));
                return model;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }
        public bool Delete(Guid Id)
        {
            var result = Find(Id);
            if (result != null)
            {
                if (result.Tags.Any())
                {
                    throw new Exception("Không được phép xóa do phòng ban có tag");
                }
                else
                {
                    result.Delete = true;
                    result.LastModifiedDate = DateTime.Now;
                    return true;
                }

            }
            else
            {
                throw new Exception("Không tìm thấy phòng ban");
            }
        }

        
        public async Task<Department> InsertAsync(DepartmentViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }

    }
}
