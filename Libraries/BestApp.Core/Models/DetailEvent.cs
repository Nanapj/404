using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class DetailEvent: Entity
    {
        public string Serial { get; set; }
        public string Note { get; set; }
        public virtual Event Event { get; set; }
        public virtual ProductType ProductType { get; set; }
        public string AgencySold { get; set; }
        public DateTime DateSold { get; set; }
        public string AssociateName { get; set; }
    }
}
