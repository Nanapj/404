using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain.PiShop
{
    public class ProductAttributeViewModel
    {
        public string Name { get; set; }
        public Guid? ID { get; set; }
        public Guid ProductTypeID { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        //ghi chú thuộc tính: VD: xe Exciter, cửa mita doors
        public string Note { get; set; }
    }
}
