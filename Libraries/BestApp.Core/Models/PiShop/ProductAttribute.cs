using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models.PiShop
{
    public class ProductAttribute: Entity
    {
        public string Name { get; set; }
        public virtual ProductType ProductType { get; set; }
    }
}
