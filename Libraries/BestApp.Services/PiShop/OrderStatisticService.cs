using BestApp.Core.Models;
using BestApp.Core.Models.PiShop;
using BestApp.Domain;
using BestApp.Domain.PiShop;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using Repository.Repositories;
using Service;
using Service.Pattern;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BestApp.Services.PiShop.OrderStatisticService;

namespace BestApp.Services.PiShop
{
    public class OrderStatisticService : Service<OrderStatistic>, IOrderStatisticService
    {
        public interface IOrderStatisticService : IService<OrderStatistic>
        {
            OrderStatistic Insert(OrderStatisticViewModel model, string CurrentId);
            Task<OrderStatistic> InsertAsync(OrderStatisticViewModel model, string CurrentId);
            Task<OrderStatisticViewModel> UpdateAsync(OrderStatisticViewModel model, string CurrentId);
            Task<IQueryable<OrderStatisticViewModel>> GetAllOrderStatisticsAsync();
            IQueryable<OrderStatisticViewModel> GetAllOrderStatistics();
            bool Delete(Guid Id);
        }
        public OrderStatisticService(IRepositoryAsync<OrderStatistic> repository) : base(repository)
        {
            
        }
        public Task<IQueryable<OrderStatisticViewModel>> GetAllOrderStatisticsAsync()
        {
            return Task.Run(() => GetAllOrderStatistics());
        }

        public IQueryable<OrderStatisticViewModel> GetAllOrderStatistics()
        {
            var result = Queryable().Where(x=> x.Delete == false)
            .Select(x => new OrderStatisticViewModel
            {
                ID = x.Id,
                CreatDate = x.CreatDate,
                OrderDetailId = x.OrderDetailId,
                OrderId = x.OrderId,
                ProductAttributeId = x.ProductAttributeId,
                ProductAttributeName = x.ProductAttributeName,
                ProductAttributeNote = x.ProductAttributeNote,
                ProductId = x.ProductId,
                Serial = x.Serial
            });
            return result;
        }
        public async Task<OrderStatistic> InsertAsync(OrderStatisticViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public OrderStatistic Insert(OrderStatisticViewModel model, string CurrentId)
        {
            var data = new OrderStatistic();
            data.OrderDetailId = model.OrderDetailId;
            data.OrderId = model.OrderId;
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            data.ProductAttributeId = model.ProductAttributeId;
            data.ProductAttributeName = model.ProductAttributeName;
            data.ProductAttributeNote = model.ProductAttributeNote;
            data.Serial = model.Serial;
            data.Delete = false;
            base.Insert(data);
            return data;
        }
        public bool Update(OrderStatisticViewModel model, string CurrentId)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.ProductAttributeNote = model.ProductAttributeNote;
                data.Serial = model.Serial;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;
        }
        public async Task<OrderStatisticViewModel> UpdateAsync(OrderStatisticViewModel model, string CurrentId)
        {
            try
            {
                await Task.Run(() => Update(model, CurrentId));
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
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
