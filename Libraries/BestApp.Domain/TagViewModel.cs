﻿using BestApp.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Domain
{
    public class TagViewModel
    {
        public Guid ID { get; set; }
        public string NameTag { get; set; }
        public StatusTag Status { get; set; }
        public string CodeTag { get; set; }
        public Guid DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public List<EventViewModel> Events { get; set; } = new List<EventViewModel>();
    }
}
