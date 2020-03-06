using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models.PiShop
{
    public class OrderStatistic: Entity
    {
        public Guid? OrderId { get; set; }
        public Guid? OrderDetailId { get; set; }
        public Guid? ProductId { get; set; }
        public Guid? ProductAttributeId { get; set; }
        public string ProductAttributeName { get; set; }
        public string ProductAttributeNote { get; set; }
        public string Serial { get; set; }
    }
}
