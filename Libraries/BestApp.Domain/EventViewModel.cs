using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class EventViewModel
    {
        public Guid? ID { get; set; }
        public Guid EventTypeID { get; set; }
        public Guid EventPurposeID { get; set; }
        public string Code { get; set; }
        public Guid? CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Birthday { get; set; }
        public string Type { get; set; }
        public string Note { get; set; }
        public string EventTypeName { get; set; }
        public string EventPurposeName { get; set; }
        public StatusEvent Status { get; set; }
        public List<TagViewModel> Tags { get; set; } = new List<TagViewModel>();
        public List<DetailEventViewModel> DetailEvents { get; set; } = new List<DetailEventViewModel>();
        public List<InteractionHistoryViewModel> InteractionHistories { get; set; } = new List<InteractionHistoryViewModel>();
        public List<ReminderNoteViewModel> ReminderNotes { get; set; } = new List<ReminderNoteViewModel>();
        public List<EStatusLogViewModel> EStatusLogs { get; set; } = new List<EStatusLogViewModel>();
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string UserName { get; set; }
        public bool Delete { get; set; }
        public Guid? ProductID { get; set; }
     
    }
}
