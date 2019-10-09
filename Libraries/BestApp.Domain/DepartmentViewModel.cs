using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class DepartmentViewModel
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public List<TagViewModel> Tags { get; set; } = new List<TagViewModel>();
    }
}
