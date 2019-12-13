using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
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
using static BestApp.Services.ProductTypeService;

namespace BestApp.Services
{
    public class ProductTypeService : Service<ProductType>, IProductTypeService
    {
        public interface IProductTypeService : IService<ProductType>
        {
            ProductType Insert(ProductTypeViewModel model, string CurrentId);
            Task<ProductType> InsertAsync(ProductTypeViewModel model, string CurrentId);
            Task<ProductTypeViewModel> UpdateAsync(ProductTypeViewModel model);
            Task<IQueryable<ProductTypeViewModel>> GetAllProductTypesAsync(SearchViewModel model);
            IQueryable<ProductTypeViewModel> GetAllProductTypes();
            bool Delete(Guid Id);
        }

        private readonly IRepositoryAsync<ApplicationUser> _userRepository;

        public ProductTypeService(IRepositoryAsync<ProductType> repository, IRepositoryAsync<ApplicationUser> userRepository) : base(repository)
        {
            _userRepository = userRepository;   
        }
        public IQueryable<ProductTypeViewModel> GetAllProductTypes()
        {
            return Queryable().Where(x => x.Delete == false)
            .Select(x => new ProductTypeViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                Code = x.Code
            });
        }
        public Task<IQueryable<ProductTypeViewModel>> GetAllProductTypesAsync(SearchViewModel model)
        {
            return Task.Run(() => GetAllProductTypes());
        }
        public ProductType Insert(ProductTypeViewModel model, string CurrentId)
        {
            var find = Queryable().Where(x => x.Code == model.Code && x.Delete == false).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Khách hàng đã tồn tại");
            }
            else
            {
                var data = new ProductType();
                data.Code = model.Code;
                data.Name = model.Name;
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.UserAccount = _userRepository.Find(CurrentId);
                data.LastModifiedDate = DateTime.Now;
                base.Insert(data);
                return data;
            }
        }
        public async Task<ProductType> InsertAsync(ProductTypeViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public bool Update(ProductTypeViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.Code = model.Code;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<ProductTypeViewModel> UpdateAsync(ProductTypeViewModel model)
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
                throw new Exception("Không tìm thấy loại sản phẩm");
            }
        }
    }
}
