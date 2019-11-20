using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class InteractionHistoryGroupViewModel
    {
        //public string CustomerName { get; set; }
        //public string CustomerPhone { get; set; }
        public List<InteractionHistoryViewModel> HistoryList { get; set; } = new List<InteractionHistoryViewModel>();
    }
}
