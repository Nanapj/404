using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class Event:Entity
    {
        public string Code { get; set; }
        public string TypeEvent { get; set; }
        public StatusEvent Status { get; set; }
        public virtual ICollection<Tag> Tags { get; set; }
        public List<DetailEvent> DetailEvents { get; set; }
        public List<InteractionHistory> InteractionHistorys { get; set; }
        public List<ReminderNote> ReminderNotes { get; set; }
        public virtual Customer Customer { get; set; }
        public Guid? EmployeeID { get; set; }
    }
}
  