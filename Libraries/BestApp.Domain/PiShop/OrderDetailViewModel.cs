using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain.PiShop
{
    public class OrderDetailViewModel
    {
        public Guid? ID { get; set; }
        public Guid ProductID { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public bool IsGift { get; set; }
        public string Serial { get; set; }
        public Guid OrderID { get; set; }
        public string OrderCode { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string UserName { get; set; }
        public bool Delete { get; set; }
        public List<OrderStatisticViewModel> OrderStatistics { get; set; } = new List<OrderStatisticViewModel>();
    }
}
