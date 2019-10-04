using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class ReminderNote: Entity
    {
        public DateTime ReminderDate { get; set; }
        public Guid? EmployeeCreated { get; set; }
        public virtual Event Event { get; set; }

    }
}
