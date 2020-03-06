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
using static BestApp.Services.PiShop.OrderService;

namespace BestApp.Services.PiShop
{
    public class OrderService : Service<Order>, IOrderService
    {
        public interface IOrderService : IService<Order>
        {
            Order Insert(OrderViewModel model, string CurrentId);
            Task<Order> InsertAsync(OrderViewModel model, string CurrentId);
            Task<OrderViewModel> UpdateAsync(OrderViewModel model, string CurrentId);
            Task<IQueryable<OrderViewModel>> GetAllOrdersAsync(SearchViewModel model);
            IQueryable<OrderViewModel> GetAllOrders(SearchViewModel model);
            IEnumerable<OrderViewModel> GetOrderByPhoneNumber(SearchViewModel model);
            bool Delete(Guid Id);            
        }
        private readonly IRepositoryAsync<Order> _repository;
        private readonly CustomerService _customerService;
        private readonly OrderDetailService _orderDetailService;
        private readonly OrderStatisticService _orderStatisticService;
        private readonly IRepositoryAsync<OrderDetail> _repositoryDetail;
        private readonly IRepositoryAsync<OrderStatistic> _repositoryStatistic;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        public OrderService(IRepositoryAsync<Order> repository,
             CustomerService customerService,
             OrderDetailService orderDetailService,
             OrderStatisticService orderStatisticService,
             IRepositoryAsync<OrderDetail> repositoryDetail,
             IRepositoryAsync<OrderStatistic> repositoryStatistic,
             IRepositoryAsync<ApplicationUser> userRepository
             ) : base(repository)
        {
            _repository = repository;
            _customerService = customerService;
            _orderDetailService = orderDetailService;
            _orderStatisticService = orderStatisticService;
            _repositoryDetail = repositoryDetail;
            _repositoryStatistic = repositoryStatistic;
            _userRepository = userRepository;
        }
        public Task<IQueryable<OrderViewModel>> GetAllOrdersAsync(SearchViewModel model)
        {
            return Task.Run(() => GetAllOrders(model));
        }

        public IQueryable<OrderViewModel> GetAllOrders(SearchViewModel model)
        {
            if (model.Code != null)
            {
                var findId = _repository.Queryable().Where(x => x.Code == model.Code).Select(x => x.Id).FirstOrDefault();
                if (findId != null)
                {
                    model.ID = findId;
                }

            }
            var result = _repository.Queryable().Where(x => x.Delete == false
            && ((!(model.Code == "")) || (model.Code == x.Code))
            && ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
            && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To))))
            .Select(x => new OrderViewModel
            {
                ID = x.Id,
                CreatDate = x.CreatDate,
                Code = x.Code,
                Total = x.Total,
                SaleEmployeeName = x.SaleEmployeeName,
                SaleEmployeeID = x.SaleEmployeeID,
                IsGift = x.IsGift,
                Note = x.Note,
                CustomerName = x.Customer.Name,
                CustomerID  = x.Customer.Id,
                Address = x.Customer.Address,
                PhoneNumber = x.Customer.PhoneNumber,
                UserName = x.UserAccount.UserName,
                Appointment = x.Appointment,
                StatusOrder = x.StatusOrder,
                Source = x.Source
            });
            return result;
        }
        public IEnumerable<OrderViewModel> GetOrderByPhoneNumber(SearchViewModel model)
        {
            if (model.PhoneNumber != null)
            {
                var findId = _customerService. Queryable().Where(x => x.PhoneNumber == model.PhoneNumber).Select(x => x.Id).FirstOrDefault();
                if (findId != null)
                {
                    model.CustomerID = findId;
                }
            }
            var result = Queryable().Where(x => x.Delete == false
            && ((!(model.CustomerID == null)) || (model.CustomerID == x.Customer.Id))
            && ((!model.From.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) >= DbFunctions.TruncateTime(model.From)))
            && ((!model.To.HasValue) || (DbFunctions.TruncateTime(x.CreatDate) <= DbFunctions.TruncateTime(model.To))))
            .Select(x => new OrderViewModel
            {
                ID = x.Id,
                CreatDate = x.CreatDate,
                Code = x.Code,
                Total = x.Total,
                SaleEmployeeName = x.SaleEmployeeName,
                SaleEmployeeID = x.SaleEmployeeID,
                IsGift = x.IsGift,
                Note = x.Note,
                CustomerName = x.Customer.Name,
                CustomerID = x.Customer.Id,
                Address = x.Customer.Address,
                PhoneNumber = x.Customer.PhoneNumber,
                UserName = x.UserAccount.UserName,
                Appointment = x.Appointment,
                StatusOrder = x.StatusOrder,
                Source = x.Source
            });
            return result;
        }
        public Order Insert(OrderViewModel model, string CurrentId)
        {
            var data = new Order();
            Random generator = new Random();
            var r = generator.Next(0, 999999).ToString("D6");
            var CodeOrder = "PSHCM" + DateTime.Now.ToString("yyyy") + DateTime.Now.ToString("MM") + r;
            var find = _repository.Queryable().Where(x => x.Code == CodeOrder).Any();
            do
            {
                r = generator.Next(0, 999999).ToString("D6");
                CodeOrder = "PSHCM" + DateTime.Now.ToString("yyyy") + DateTime.Now.ToString("MM") + r;
                find = _repository.Queryable().Where(x => x.Code == CodeOrder).Any();
            } while (find == true);

            data.Code = CodeOrder;
            data.Customer = _customerService.Find(model.CustomerID);
            data.StatusOrder = 0;
            data.UserAccount = _userRepository.Find(CurrentId);
            data.Note = model.Note;
            data.IsGift = model.IsGift;
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            data.Appointment = model.Appointment;
            data.SaleEmployeeName = model.SaleEmployeeName;
            data.SaleEmployeeID = model.SaleEmployeeID;
            data.TypeOrder = model.TypeOrder;
            data.Source = model.Source;
            OrderDetail o;
            if (model.OrderDetails != null)
            {
                data.OrderDetails = new List<OrderDetail>();
                foreach (var item in model.OrderDetails)
                {
                    o = new OrderDetail();
                    o = new OrderDetail()
                    {
                        ProductId = item.ProductID,
                        ProductName = item.ProductName,
                        Quantity = item.Quantity,
                        Price = item.Price,
                        IsGift = item.IsGift,
                        Serial = item.Serial,
                        CreatDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now,
                        UserAccount = _userRepository.Find(CurrentId),
                        Delete = false
                    };
                    data.OrderDetails.Add(o);
                    item.ID = o.Id;
                }
            }
            data.Total = model.OrderDetails.Sum(x => x.Quantity * x.Price);
            _repository.Insert(data);
            
            model.ID = data.Id;
            
            //Thêm data vào bảng OrderStatisticService
            foreach(var item in model.OrderDetails)
            {
                //nếu sản phẩm có thuộc tính
                if (item.OrderStatistics.Count != 0)
                {
                    foreach(var item1 in item.OrderStatistics)
                    {
                        var dataProduct = new OrderStatistic();
                        dataProduct.OrderId = model.ID;
                        dataProduct.ProductAttributeId = item1.ProductAttributeId;
                        dataProduct.ProductAttributeName = item1.ProductAttributeName;
                        dataProduct.ProductAttributeNote = item1.ProductAttributeNote;
                        dataProduct.CreatDate = DateTime.Now;
                        dataProduct.LastModifiedDate = DateTime.Now;
                        dataProduct.ProductId = item.ProductID;
                        dataProduct.UserAccount = _userRepository.Find(CurrentId);
                        dataProduct.OrderDetailId = item.ID;
                        dataProduct.Serial = item.Serial;
                        _repositoryStatistic.Insert(dataProduct);
                    }
                    
                }
                else
                {
                    var dataProduct = new OrderStatistic();
                    dataProduct.OrderId = model.ID;
                    dataProduct.CreatDate = DateTime.Now;
                    dataProduct.LastModifiedDate = DateTime.Now;
                    dataProduct.ProductId = item.ProductID;
                    dataProduct.UserAccount = _userRepository.Find(CurrentId);
                    dataProduct.OrderDetailId = item.ID;
                    dataProduct.Serial = item.Serial;
                    _repositoryStatistic.Insert(dataProduct);
                }
                
            }
            
            return data;
        }
        public async Task<Order> InsertAsync(OrderViewModel model, string CurrentId)
        {
            return await Task.Run(() => Insert(model, CurrentId));
        }
        public async Task<OrderViewModel> UpdateAsync(OrderViewModel model, string CurrentId)
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
        public bool Update(OrderViewModel model, string CurrentId)
        {
            //tìm phiếu order
            var Phieu = _repository.Find(model.ID);
            if (Phieu != null)
            {
                Phieu.Delete = false;
                //xóa dữ liệu trong Detail và Stattic
                var statistic = _orderStatisticService.Queryable().Where(x => x.OrderId == model.ID).ToList();
                if (statistic != null)
                {
                    foreach(var item in statistic)
                    {
                        _repositoryStatistic.Delete(item.Id);
                    }
                    
                }
                //xóa dữ liệu trong  Stattic
                var detail = _orderDetailService.Queryable().Where(x => x.Order.Id == Phieu.Id).ToList();
                if (detail != null)
                {
                    foreach(var item in detail)
                    {
                       _repositoryDetail.Delete(item.Id);
                    }
                }
                //Tạo phiếu mới
                var data = new Order();
                data.Code = Phieu.Code;
                data.Customer = _customerService.Find(model.CustomerID);
                data.StatusOrder = model.StatusOrder;
                data.UserAccount = _userRepository.Find(CurrentId);
                data.Note = model.Note;
                data.IsGift = model.IsGift;
                data.CreatDate = Phieu.CreatDate;
                data.LastModifiedDate = DateTime.Now;
                data.Appointment = model.Appointment;
                data.SaleEmployeeName = model.SaleEmployeeName;
                data.SaleEmployeeID = model.SaleEmployeeID;
                data.TypeOrder = model.TypeOrder;
                data.Source = model.Source;
                OrderDetail o;
                if (model.OrderDetails != null)
                {
                    data.OrderDetails = new List<OrderDetail>();
                    foreach (var item in model.OrderDetails)
                    {
                        o = new OrderDetail();
                        o = new OrderDetail()
                        {
                            ProductId = item.ProductID,
                            ProductName = item.ProductName,
                            Quantity = item.Quantity,
                            Price = item.Price,
                            IsGift = item.IsGift,
                            Serial = item.Serial,
                            CreatDate = Phieu.CreatDate,
                            LastModifiedDate = DateTime.Now,
                            UserAccount = _userRepository.Find(CurrentId),
                            Delete = false
                        };
                        data.OrderDetails.Add(o);
                        item.ID = o.Id;
                    }
                }
                data.Total = model.OrderDetails.Sum(x => x.Quantity * x.Price);
                _repository.Insert(data);
                model.ID = data.Id;

                //Thêm data vào bảng OrderStatisticService
                foreach (var item in model.OrderDetails)
                {
                    //nếu sản phẩm có thuộc tính
                    if (item.OrderStatistics.Count != 0)
                    {
                        foreach (var item1 in item.OrderStatistics)
                        {
                            var dataProduct = new OrderStatistic();
                            dataProduct.OrderId = model.ID;
                            dataProduct.ProductAttributeId = item1.ID;
                            dataProduct.ProductAttributeName = item1.ProductAttributeName;
                            dataProduct.ProductAttributeNote = item1.ProductAttributeNote;
                            dataProduct.CreatDate = Phieu.CreatDate;
                            dataProduct.LastModifiedDate = DateTime.Now;
                            dataProduct.ProductId = item.ProductID;
                            dataProduct.UserAccount = _userRepository.Find(CurrentId);
                            dataProduct.OrderDetailId = item.ID;
                            dataProduct.Serial = item.Serial;
                            _repositoryStatistic.Insert(dataProduct);
                        }

                    }
                    else
                    {
                        var dataProduct = new OrderStatistic();
                        dataProduct.OrderId = model.ID;
                        dataProduct.CreatDate = Phieu.CreatDate;
                        dataProduct.LastModifiedDate = DateTime.Now;
                        dataProduct.ProductId = item.ProductID;
                        dataProduct.UserAccount = _userRepository.Find(CurrentId);
                        dataProduct.OrderDetailId = item.ID;
                        dataProduct.Serial = item.Serial;
                        _repositoryStatistic.Insert(dataProduct);
                    }
                }
                //Xóa phiếu
                _repository.Delete(Phieu.Id);
            }
            
            return true;
        }
        public bool UpdateStatus(OrderViewModel model)
        {
            var Phieu = _repository.Find(model.ID);
            if (Phieu != null)
            {
                Phieu.StatusOrder = model.StatusOrder;
                Phieu.LastModifiedDate = DateTime.Now;
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy phiếu");
            }

        }
        
        public bool Delete(Guid Id)
        {
            var result = _repository.Find(Id);
            if (result != null)
            {
                //Xóa phiếu
                result.Delete = true;
                result.LastModifiedDate = DateTime.Now;
                //Xóa Stattic
                var statistic = _orderStatisticService.Queryable().Where(x => x.OrderId == Id).ToList();
                if (statistic != null)
                {
                    foreach (var item in statistic)
                    {
                        item.Delete = true;
                    }

                }
                //xóa dữ liệu trong detail 
                var detail = _orderDetailService.Queryable().Where(x => x.Order.Id == Id).ToList();
                if (detail != null)
                {
                    foreach (var item in detail)
                    {
                        item.Delete = true;
                    }
                }
                return true;

            }
            else
            {
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
