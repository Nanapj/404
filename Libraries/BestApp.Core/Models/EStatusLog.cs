using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class EStatusLog : Entity
    {
        public StatusEvent Status { get; set; }
        public string Note { get; set; }
        public Guid EventId { get; set; }
        public string EventCode { get; set; }
    }
}
