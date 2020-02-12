using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models.PiShop
{
    public class BlogPS : Entity
    {
        public string Category { get; set; }
        public string Note { get; set; }
        public List<TopicPS> TopicPSs { get; set; } = new List<TopicPS>();
    }
}
