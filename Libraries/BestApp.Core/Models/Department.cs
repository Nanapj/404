using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class Department : Entity
    {
        public string Name { get; set; }
        public List<Tag> Tags { get; set; } = new List<Tag>();
    }
}
