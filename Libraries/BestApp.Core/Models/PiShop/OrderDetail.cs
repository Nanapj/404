using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models.PiShop
{
    public class OrderDetail:Entity
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public bool IsGift { get; set; }
        public string Serial { get; set; }
        public virtual Order Order { get; set; }
         
    }
}
