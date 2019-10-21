using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class ProductTypeViewModel
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public List<DetailEventViewModel> DetailEvents { get; set; } = new List<DetailEventViewModel>();
    }
}
