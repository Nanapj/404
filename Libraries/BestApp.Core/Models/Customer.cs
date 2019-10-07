using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class Customer : Entity
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Birthday { get; set; }
        public string Type { get; set; }
        public string Note { get; set; }
        public List<CustomerTag> CustomerTags { get; set; }
        public virtual ICollection<Customer> Customers { get; set; }
        public List<Event> Events { get; set; }
        public string District { get; set; }
        public string Ward { get; set; }
        public string City { get; set; }

    }
}
