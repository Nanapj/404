using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class EventType : Entity
    {
        public string Name { get; set; }
        public List<EventPurpose> EventPurposes { get; set; }
    }
}
