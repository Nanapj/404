using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class CustomerViewModel
    {
        public Guid? ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Birthday { get; set; }
        public string Type { get; set; }
        public string Note { get; set; }
        public List<CustomerTagViewModel> CustomerTags { get; set; } = new List<CustomerTagViewModel>();
        public List<CustomerViewModel> Customers { get; set; } = new List<CustomerViewModel>();
        public List<EventViewModel> Events { get; set; } = new List<EventViewModel>();
    }
}
