using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class ReminderNoteViewModel
    {
        public Guid? ID { get; set; }
        public DateTime ReminderDate { get; set; }
        public Guid? EventID { get; set; }
        public string Note { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool Delete { get; set; }
        public string Serial { get; set; }
    }
}
 