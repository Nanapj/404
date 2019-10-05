using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class Entity
    {
        public Guid Id { get; set; }
        public DateTime CreatDate { get; set; }
        public bool Delete { get; set; }
        public ApplicationUser UserAccount { get; set; }
    }
}
