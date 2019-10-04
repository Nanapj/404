using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class Tag : Entity
    {
        public string NameTag { get; set; }
        public StatusTag Status { get; set; }
        public string CodeTag { get; set; }
        public virtual ICollection<Department> Departments { get; set; }
        public virtual ICollection<Event> Events { get; set; }
    }
}
