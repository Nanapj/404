using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class EventPurposeViewModel
    {
        public Guid? ID { get; set; }
        public string Name { get; set; }
        public Guid? EventTypeID { get; set; }
        public string EventTypeName { get; set; }
    }
}
