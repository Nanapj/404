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
            Customer Insert(CustomerViewModel model);
            Task<Customer> InsertAsync(CustomerViewModel model);
            Task<CustomerViewModel> UpdateAsync(CustomerViewModel model);
            Task<IQueryable<CustomerViewModel>> GetAllCustomersAsync(SearchViewModel model);
            IQueryable<Customer> GetAllCustomers();
            bool Delete(Guid Id);
        }
        private readonly CustomerService _customerService;
        private readonly IRepositoryAsync<Customer> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public CustomerService(IRepositoryAsync<Customer> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<Customer> GetAllCustomers()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<CustomerViewModel>> GetAllCustomersAsync(SearchViewModel model)
        {
            return Task.Run(() => GetAllCustomers()
            .Where(x=> x.Delete == false && ((x.PhoneNumber.Contains(model.PhoneNumber))))
            .Select(x => new CustomerViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber ,
                Address = x.Address,
                District = x.District,
                Ward = x.Ward,
                Birthday = x.Birthday,
                Note = x.Note,
                City = x.City,
            }));
        }
        public Customer Insert(CustomerViewModel model)
        {
            var find = Queryable().Where(x => x.PhoneNumber == model.PhoneNumber && x.Delete == false).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Khách hàng đã tồn tại");
            }
            else
            {
                var data = new Customer();

                data.Name = model.Name;
                data.PhoneNumber = model.PhoneNumber;
                data.Address = model.Address;
                data.District = model.District;
                data.Ward = model.Ward;
                data.City = model.City;
                data.Note = model.Note;
                data.Birthday = model.Birthday;
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.LastModifiedDate = DateTime.Now;
                //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
                base.Insert(data);
                return data;
            }
        }
        public async Task<Customer> InsertAsync(CustomerViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public bool Update(CustomerViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.PhoneNumber = model.PhoneNumber;
                data.Address = model.Address;
                data.District = model.District;
                data.Ward = model.Ward;
                data.City = model.City;
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
