﻿using BestApp.Core.Models;
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
            Staff Insert(StaffViewModel model, string CurrentId);
            Task<Staff> InsertAsync(StaffViewModel model, string CurrentId);
            Task<IQueryable<StaffViewModel>> GetAllStaffsAsync();
            Task<StaffViewModel> UpdateAsync(StaffViewModel model);
            bool Delete(Guid Id);
        }

        private readonly IRepositoryAsync<Staff> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;

        public StaffService(IRepositoryAsync<Staff> repository,
            IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            _userRepository = userRepository;
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
            
        }

        public Staff Insert(StaffViewModel model, string CurrentId)
        {
            var check = Queryable().Where(x=> x.Email == model.Email).FirstOrDefault();
            if(check != null)
            {
                throw new Exception("Email đã dược sử dụng để đăng kí");
            }
            else
            {
                var data = new Staff()
                {
                    FullName = model.FullName,
                    Address = model.Address,
                    Email = model.Email,
                    CreatDate = DateTime.Now,
                    HasAccount = model.HasAccount,
                    LastModifiedDate = DateTime.Now,
                    Phone = model.Phone,
                    UserAccount = _userRepository.Find(CurrentId),
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
            
        }
        
        public void Update(StaffViewModel model)
        {
            var data = Find(model.ID);
            var user = userManager.FindByEmail(model.Email);
            if (data != null)
            {
                data.FullName = model.FullName;
                data.Address = model.Address;
                data.Email = model.Email;
                data.CreatDate = DateTime.Now;
                data.HasAccount = model.HasAccount;
                data.Phone = model.Phone;
                data.LastModifiedDate = DateTime.Now;
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
        public bool Delete(Guid Id)
        {
            var data = Find(Id);
            var user = userManager.FindByEmail(data.Email);
            if (data != null)
            {
                data.Delete = true;
                data.LastModifiedDate = DateTime.Now;
                if (user != null)
                {
                    user.IsBanned = true;
                    user.LockoutEnabled = true;
                    userManager.Update(user);
                }
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy nhân viên");
            }

        }

        public IQueryable<Staff> GetAllStaffs()
        {
            return _repository.Queryable();
        }

        public async Task<Staff> InsertAsync(StaffViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
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
        
        public Task<IQueryable<StaffViewModel>> GetAllStaffsAsync()
        {
            return Task.Run(() => GetAllStaffs()
            .Where(x => x.Delete == false)
            .Select(x => new StaffViewModel() {
                ID = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Address = x.Address,
                HasAccount = x.HasAccount,
                Phone = x.Phone
            }));
        }
    }
}
