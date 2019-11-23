using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class DetailEventViewModel
    {
        public Guid? ID { get; set; }
        public string Serial { get; set; }
        public string Note { get; set; }
        public Guid EventID { get; set; }
        public string EventCode { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool Delete { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public Guid ProductID { get; set; }
        public string AgencySold { get; set; }
        public DateTime? DateSold { get; set; }
        public string AssociateName { get; set; }
    }
}
