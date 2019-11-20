using BestApp.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class EventTypeViewModel
    {
        public Guid? ID { get; set; }
        public string Name { get; set; }
        public List<EventPurposeViewModel> EventPurposes { get; set; } = new List<EventPurposeViewModel>();
    }
}
