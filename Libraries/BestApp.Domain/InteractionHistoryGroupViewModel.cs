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
        public Guid? Id { get; set; } = new Guid("ebda6b1c-8d58-4cdd-adcf-aafe004e9e19");
        public List<InteractionHistoryViewModel> HistoryList { get; set; } = new List<InteractionHistoryViewModel>();
    }
}
