using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class DetailEventViewModel
    {
        public Guid? ID { get; set; }
        public string Serial { get; set; }
        public string Note { get; set; }
        public EventViewModel Event { get; set; }
    }
}
