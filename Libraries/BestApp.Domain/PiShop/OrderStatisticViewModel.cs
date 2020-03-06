using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain.PiShop
{
    public class OrderStatisticViewModel
    {
        public Guid? ID { get; set; }
        public Guid? OrderId { get; set; }
        public Guid? OrderDetailId { get; set; }
        public Guid? ProductId { get; set; }
        public Guid? ProductAttributeId { get; set; }
        public string ProductAttributeName { get; set; }
        public string ProductAttributeNote { get; set; }
        public string Serial { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string UserName { get; set; }
        public bool Delete { get; set; }
    }
}
