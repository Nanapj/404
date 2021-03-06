﻿using BestApp.Core.Models;
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
using static BestApp.Services.PiShop.OrderDetailService;

namespace BestApp.Services.PiShop
{
    public class OrderDetailService : Service<OrderDetail>, IOrderDetailService
    {
        public interface IOrderDetailService : IService<OrderDetail>
        {
            OrderDetail Insert(OrderDetailViewModel model, string CurrentId);
            Task<OrderDetail> InsertAsync(OrderDetailViewModel model, string CurrentId);
            Task<IQueryable<OrderDetailViewModel>> GetOrderDetailsAsync(SearchViewModel model);
            IQueryable<OrderDetailViewModel> GetOrderDetailByOrder(SearchViewModel model);
            bool Delete(Guid Id);
        }
        private readonly OrderStatisticService _orderStatisticService;

        private readonly IRepositoryAsync<OrderStatistic> _repositoryOrderStatic;
        private readonly IRepositoryAsync<Order> _repositoryOrder;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        public OrderDetailService(IRepositoryAsync<OrderDetail> repository,
             OrderStatisticService orderStatisticService,
             IRepositoryAsync<OrderStatistic> repositoryOrderStatic,
             IRepositoryAsync<Order> repositoryOrder,
             IRepositoryAsync<ApplicationUser> userRepository
             ) : base(repository)
        {
            
            _orderStatisticService = orderStatisticService;
            _repositoryOrder = repositoryOrder;
            _repositoryOrderStatic = repositoryOrderStatic;
            db = new DataContext();

        }
        public Task<IQueryable<OrderDetailViewModel>> GetOrderDetailsAsync(SearchViewModel model)
        {
            return Task.Run(() => GetOrderDetailByOrder(model));
        }
        public IQueryable<OrderDetailViewModel> GetOrderDetailByOrder(SearchViewModel model)
        {
            var result = Queryable().Where(x => x.Delete == false
            && ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
            && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To)))).
            Select(x => new OrderDetailViewModel
            {
                ID = x.Id,
                ProductID = x.ProductId,
                ProductName = x.ProductName,
                Quantity = x.Quantity,
                Price = x.Price,
                Serial = x.Serial,
                CreatDate = x.CreatDate,
                IsGift = x.IsGift,
                UserName = x.UserAccount.UserName,
                OrderCode = x.Order.Code,
                OrderID = x.Order.Id
            }).ToList();
            if (result != null)
            {
                foreach (var item in result)
                {
                    var r = _orderStatisticService.Queryable().Where(x => x.Delete == false
                    && x.OrderDetailId == item.ID).ToList();
                    if (r != null)
                    {
                        foreach (var item1 in r)
                        {
                            var a = new OrderStatisticViewModel();
                            a.ProductAttributeName = item1.ProductAttributeName;
                            a.ProductAttributeId = item1.ProductAttributeId;
                            a.ProductAttributeNote = item1.ProductAttributeNote;
                            a.Serial = item1.Serial;
                            a.ID = item1.Id;
                            item.OrderStatistics.Add(a);
                        }
                    }
                }
            }
            return result.AsQueryable();

        }
        public OrderDetail Insert(OrderDetailViewModel model, string CurrentId)
        {
            var data = new OrderDetail();
            data.Order = _repositoryOrder.Find(model.OrderID);
            data.ProductId = model.ProductID;
            data.Quantity = model.Quantity;
            data.Price = model.Price;
            data.IsGift = model.IsGift;
            data.ProductName = model.ProductName;
            data.Serial = model.Serial;
            data.Delete = false;
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            data.UserAccount = _userRepository.Find(CurrentId);
            base.Insert(data);
            db.SaveChanges();
            if (model.OrderStatistics != null)
            {
                foreach(var item in model.OrderStatistics)
                {
                    var r = new OrderStatistic();
                    r.CreatDate = DateTime.Now;
                    r.LastModifiedDate = DateTime.Now;
                    r.UserAccount = _userRepository.Find(CurrentId);
                    r.ProductAttributeId = item.ProductAttributeId;
                    r.ProductAttributeName = item.ProductAttributeName;
                    r.ProductAttributeNote = item.ProductAttributeNote;
                    r.ProductId = model.ProductID;
                    r.Serial = model.Serial;
                    r.OrderId = model.OrderID;
                    r.OrderDetailId = data.Id;
                    _repositoryOrderStatic.Insert(r);
                    db.SaveChanges();
                }
            }
            return data;
        }
        public async Task<OrderDetail> InsertAsync(OrderDetailViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
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
