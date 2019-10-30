﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class InteractionHistoryViewModel
    {
        public Guid? ID { get; set; }
        public string Type { get; set; }
        public string Note { get; set; }
        public Guid? EmployeeCall { get; set; }
        public Guid? EmployeeID { get; set; }
        public Guid EventID { get; set; }
        public string EventCode { get; set; }
        public DateTime CreatDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool Delete { get; set; }
    }
}
