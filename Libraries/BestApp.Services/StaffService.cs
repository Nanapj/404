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
            Task<StaffViewModel> UpdateAsync(StaffViewModel model);
            Task<StaffViewModel> DeleteAsync(StaffViewModel model);
        }

        private readonly IRepositoryAsync<Staff> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;

        public StaffService(IRepositoryAsync<Staff> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
            
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
            if (data.HasAccount)
            {            
                var user = new ApplicationUser();
                user.Email = model.Email;
                user.UserName = model.Email;
                string userPWD = model.Password;

                var result = userManager.Create(user, userPWD);
            }

            base.Insert(data);

            return data;
        }
        
        public void Update(StaffViewModel model)
        {
            var data = Find(model.Id);
            var user = userManager.FindByEmail(model.Email);
            if (data != null)
            {
                data.FullName = model.FullName;
                data.Address = model.Address;
                data.Email = model.Email;
                data.CreatDate = DateTime.Now;
                data.HasAccount = model.HasAccount;
                data.Phone = model.Phone;
            }
            if(user != null)
            {
                if(model.HasAccount == false && user.IsBanned == false)
                {
                    user.IsBanned = true;
                    userManager.Update(user);
                } else if(model.HasAccount == true && (model.Password != null && model.Password != ""))
                {
                    String hashedNewPassword = userManager.PasswordHasher.HashPassword(model.Password);

                    userManager.RemovePassword(user.Id);
                    var result = userManager.AddPassword(user.Id, model.Password);
                    if(!result.Succeeded)
                    {
                        throw new Exception("Thay đổi mật khẩu thất bại");
                    }
                }
                
            } else
            {
                if(model.HasAccount == true)
                {
                    var newUser = new ApplicationUser();
                    newUser.Email = model.Email;
                    newUser.UserName = model.Email;
                    string userPWD = model.Password;

                    var result = userManager.Create(user, userPWD);
                }
            }
        }
        public void Delete(StaffViewModel model)
        {
            var data = Find(model.Id);
            var user = userManager.FindByEmail(model.Email);
            if (data != null)
            {
                data.Delete = true;
            }
            if (user != null)
            {
                user.IsBanned = true;
                user.LockoutEnabled = true;
                userManager.Update(user);
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
        public async Task<StaffViewModel> UpdateAsync(StaffViewModel model)
        {
            try
            {
                await Task.Run(() => Update(model));
                return model;
            }
            catch(Exception e)
            {
                throw (e);
            }
        }
        public async Task<StaffViewModel> DeleteAsync(StaffViewModel model)
        {
            try
            {
                await Task.Run(() => Delete(model));
                return model;
            }
            catch (Exception e)
            {
                throw (e);
            }
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
