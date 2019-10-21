using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class ProductType : Entity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public List<DetailEvent> DetailEvents { get; set; } = new List<DetailEvent>();
    }
}
