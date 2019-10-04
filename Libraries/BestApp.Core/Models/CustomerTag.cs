using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class CustomerTag : Entity
    {
        public string CodeTag { get; set; }
        public string NameTag { get; set; }
        public StatusTag Status { get; set; }
        public virtual Customer Customer { get; set; }
    }
}
