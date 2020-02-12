using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain.PiShop
{
    public class TopicPSViewModel
    {
        public Guid ID { get; set; }
        public string Title { get; set; }
        public string Decription { get; set; }
        public string Content { get; set; }
        public Guid BlogPSID { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool Delete { get; set; }
    }
}
