using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class SearchViewModel
    {
        public string Name { get; set; }
        public Guid? ID { get; set; }
        public string PhoneNumber { get; set; }
        public string Code { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
