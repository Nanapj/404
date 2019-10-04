using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class CustomerTagViewModel
    {
        public Guid? ID { get; set; }
        public string CodeTag { get; set; }
        public string NameTag { get; set; }
        public StatusTag Status { get; set; }
        public CustomerViewModel Customer { get; set; }
    }
}
