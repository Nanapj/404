using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class InteractionHistory: Entity
    {
        public string Type { get; set; }
        public string Note { get; set; }
        public Guid? EmployeeCall { get; set; }
        public Guid? EmployeeID { get; set; }
        public virtual Event Event { get; set; }
       
    }
}
