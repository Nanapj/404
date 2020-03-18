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
using static BestApp.Services.CustomerService;

namespace BestApp.Services
{
    public class CustomerService: Service<Customer>, ICustomerService
    {
        public interface ICustomerService : IService<Customer>
        {
            Customer Insert(CustomerViewModel model, string CurrentId);
            Task<Customer> InsertAsync(CustomerViewModel model, string CurrentId);
            Task<CustomerViewModel> UpdateAsync(CustomerViewModel model);
            Task<IQueryable<CustomerViewModel>> GetAllCustomersAsync(SearchViewModel model);
            IQueryable<CustomerViewModel> GetAllCustomers();
            bool Delete(Guid Id);
        }
        private readonly IRepositoryAsync<Customer> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public CustomerService(IRepositoryAsync<Customer> repository,
            IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
            _userRepository = userRepository;
        }
        public IQueryable<CustomerViewModel> GetAllCustomers()
        {
            return _repository.Queryable().Where(x => x.Delete == false)
            .Select(x => new CustomerViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                Address = x.Address,
                District = x.District,
                Ward = x.Ward,
                Birthday = x.Birthday,
                Note = x.Note,
                City = x.City,
            });
        }
        public Task<IQueryable<CustomerViewModel>> GetAllCustomersAsync(SearchViewModel model)
        {
            return Task.Run(() => GetAllCustomers());
        } 
        public Customer Insert(CustomerViewModel model, string CurrentId)
        {
            var find = Queryable().Where(x => x.PhoneNumber.Trim() == model.PhoneNumber.Trim() && x.Delete == false).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Khách hàng đã tồn tại");
            }
            else
            {
                var data = new Customer();
                var BirthdayString = model.Birthday;
                data.Name = model.Name;
                data.PhoneNumber = model.PhoneNumber;
                data.Address = model.Address;
                data.District = model.District;
                data.Ward = model.Ward;
                data.City = model.City;
                data.Note = model.Note;
                data.Birthday = (DateTime)model.Birthday;
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.LastModifiedDate = DateTime.Now;
                data.UserAccount = _userRepository.Find(CurrentId);
                //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
                base.Insert(data);
                return data;
            }
        }
        public async Task<Customer> InsertAsync(CustomerViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public bool Update(CustomerViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.PhoneNumber = model.PhoneNumber;
                data.Address = model.Address;
                if (model.District != null || model.Ward != null || model.City != null)
                {
                    data.District = model.District;
                    data.Ward = model.Ward;
                    data.City = model.City;
                }
                data.Note = model.Note;
                data.Birthday = model.Birthday;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<CustomerViewModel> UpdateAsync(CustomerViewModel model)
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
                result.Delete = true;
                result.LastModifiedDate = DateTime.Now;
                return true;

            }
            else
            {
                throw new Exception("Không tìm thấy khách hàng");
            }
        }
    }
}
