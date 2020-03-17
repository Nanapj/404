using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models.PiShop
{
    public class Order: Entity
    {
        public Order()
        {
            OrderDetails = new List<OrderDetail>();
        }
        public string Code { get; set; }
        public virtual Customer Customer { get; set; }
        public double Total { get; set; }
        public string Note { get; set; }
        public bool IsGift { get; set; }
        public Guid? SaleEmployeeID { get; set; }
        public string SaleEmployeeName { get; set; }
        //Thời gian khách hẹn ghé 
        public DateTime? Appointment { get; set; }
        public string Source { get; set; }
        public List<OrderDetail> OrderDetails { get; set; }
        //Loại mục khách hàng: mua hoặc tham khảo
        public string TypeOrder { get; set; }
        public StatusOrder StatusOrder { get; set; }
        public StatusSeen StatusSeen { get; set; }
        public void TotalCal()
        {
            Total = OrderDetails.Sum(x => x.Quantity * x.Price);
        }
    }
}
