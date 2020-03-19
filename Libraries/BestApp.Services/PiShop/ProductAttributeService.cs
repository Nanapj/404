using BestApp.Core.Models;
using BestApp.Core.Models.PiShop;
using BestApp.Domain.PiShop;
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
using static BestApp.Services.PiShop.ProductAttributeService;

namespace BestApp.Services.PiShop
{
    public class ProductAttributeService : Service<ProductAttribute>, IProductAttributeService
    {
        public interface IProductAttributeService : IService<ProductAttribute>
        {
            ProductAttribute Insert(ProductAttributeViewModel model, string CurrentId);
            Task<ProductAttribute> InsertAsync(ProductAttributeViewModel model, string CurrentId);
            Task<IQueryable<ProductAttributeViewModel>> GetAllProductAttributesAsync();
            ProductAttributeViewModel GetProductAttributes(Guid ID);
            Task<ProductAttributeViewModel> GetProductAttributesAsync(Guid ID);
            IQueryable<ProductAttribute> GetAllProductAttributes();
            Task<ProductAttributeViewModel> UpdateAsync(ProductAttributeViewModel model);
            bool Delete(Guid Id);
        }
        private readonly ProductTypeService _productTypeService;
        protected UserManager<ApplicationUser> userManager;
        public ProductAttributeService(IRepositoryAsync<ProductAttribute> repository,
            ProductTypeService productTypeService) : base(repository)
        {
           
            _productTypeService = productTypeService;
           
        }
        public IQueryable<ProductAttribute> GetAllProductAttributes()
        {

            return Queryable();
        }
        public Task<IQueryable<ProductAttributeViewModel>> GetAllProductAttributesAsync()
        {
            return Task.Run(() => GetAllProductAttributes().Where(x => x.Delete == false).OrderByDescending(x => x.CreatDate)
            .Select(x => new ProductAttributeViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                ProductCode = x.ProductType.Code,
                ProductName = x.ProductType.Name
            }));
        }
        public ProductAttributeViewModel GetProductAttributes(Guid ID)
        {
            var result = GetAllProductAttributes().Where(x => x.Delete == false && x.ProductType.Id == ID)
            .Select(x => new ProductAttributeViewModel()
            {
                ID = x.Id,
                Name = x.Name,
                ProductCode = x.ProductType.Code,
                ProductName = x.ProductType.Name
            }).FirstOrDefault();
            return result;
        }

        public Task<ProductAttributeViewModel> GetProductAttributesAsync(Guid ID)
        {
            return Task.Run(() => GetProductAttributes(ID));
        }
        public ProductAttribute Insert(ProductAttributeViewModel model, string CurrentId)
        {
            var data = new ProductAttribute();
            data.Name = model.Name;
            data.ProductType = _productTypeService.Find(model.ProductTypeID);
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            base.Insert(data);
            return data;
        }
        public async Task<ProductAttribute> InsertAsync(ProductAttributeViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public async Task<ProductAttributeViewModel> UpdateAsync(ProductAttributeViewModel model)
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
        public bool Update(ProductAttributeViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Name = model.Name;
                data.LastModifiedDate = DateTime.Now;
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy thuộc tính sản phẩm");
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
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
