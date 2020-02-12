using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain.PiShop
{
    public class BlogPSViewModel
    {
        public Guid ID { get; set; }
        public string Category { get; set; }
        public string Note { get; set; }
        public List<TopicPSViewModel> TopicPSs { get; set; } = new List<TopicPSViewModel>();
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool Delete { get; set; }
    }
}
