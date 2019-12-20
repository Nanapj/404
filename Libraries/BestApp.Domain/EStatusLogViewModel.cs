using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class EStatusLogViewModel
    {
        public Guid? ID { get; set; }
        public StatusEvent Status { get; set; }
        public string Note { get; set; }
        public Guid EventId { get; set; }
        public string EventCode { get; set; }
        public DateTime CreatDate { get; set; }
        public string UserName { get; set; }
    }
}
