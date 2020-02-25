using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models.PiShop
{
    public class TopicPS: Entity
    {
        public string Title { get; set; }
        public string Decription { get; set; }
        public string Content { get; set; }
        public virtual BlogPS BlogPS { get; set; }
        public string Thumbnail { get; set; }
        public string LinkVid { get; set; }

    }
}
