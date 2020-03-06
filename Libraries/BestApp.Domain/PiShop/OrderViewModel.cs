using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain.PiShop
{
    public class OrderViewModel
    {
        public Guid? ID { get; set; }
        public string Code { get; set; }
        public Guid  CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? Birthday { get; set; }
        public double Total { get; set; }
        public string Note { get; set; }
        public bool IsGift { get; set; }
        public Guid? SaleEmployeeID { get; set; }
        public string SaleEmployeeName { get; set; }
        public DateTime? Appointment { get; set; }
        public string Source { get; set; }
        public List<OrderDetailViewModel> OrderDetails { get; set; } = new List<OrderDetailViewModel>();
        public string TypeOrder { get; set; }
        public StatusOrder StatusOrder { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string UserName { get; set; }
        public bool Delete { get; set; }

    }
}
