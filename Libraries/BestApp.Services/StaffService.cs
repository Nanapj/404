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
using static BestApp.Services.StaffService;

namespace BestApp.Services
{
    public class StaffService : Service<Staff>, IStaffService
    {
        public interface IStaffService : IService<Staff>
        {
            IQueryable<Staff> GetAllStaffs();
            Staff Insert(StaffViewModel model);
            Task<Staff> InsertAsync(StaffViewModel model);
            Task<IQueryable<StaffViewModel>> GetAllStaffsAsync();
        }

        private readonly IRepositoryAsync<Staff> _repository;

        public StaffService(IRepositoryAsync<Staff> repository) : base(repository)
        {
            _repository = repository;
        }

        public Staff Insert(StaffViewModel model)
        {
            var data = new Staff()
            {
                FullName = model.FullName,
                Address = model.Address,
                Email = model.Email,
                CreatDate = DateTime.Now,
                HasAccount = model.HasAccount,
                Phone = model.Phone
            };

            // Nếu muốn tạo tài khoản
            if(data.HasAccount)
            {
                DataContext context = new DataContext();
                var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
                var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

                var user = new ApplicationUser();

                user.Email = model.Email;
                user.UserName = model.Email;
                string userPWD = model.Password;

                var result = UserManager.Create(user, userPWD);
            }

            base.Insert(data);

            return data;
        }

        public void Update(StaffViewModel model)
        {
            var data = Find(model.Id);
            if(data != null)
            {
                data.FullName = model.FullName;
                data.Address = model.Address;
                data.Email = model.Email;
                data.CreatDate = DateTime.Now;
                data.HasAccount = model.HasAccount;
                data.Phone = model.Phone;
            }
        }

        public IQueryable<Staff> GetAllStaffs()
        {
            return _repository.Queryable();
        }

        public async Task<Staff> InsertAsync(StaffViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }

        public Task<IQueryable<StaffViewModel>> GetAllStaffsAsync()
        {
            return Task.Run(() => GetAllStaffs().Select(x => new StaffViewModel() {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Address = x.Address,
                HasAccount = x.HasAccount,
                Phone = x.Phone
            }));
        }
    }
}
