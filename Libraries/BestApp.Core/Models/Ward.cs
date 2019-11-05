﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BestApp.Core.Models
{
    public class Ward
    {
        public string name { get; set; }
        public string slug { get; set; }
        public string name_with_type { get; set; }
        public string path { get; set; }
        public string path_with_type { get; set; }
        public string code { get; set; }
        public string parent_code { get; set; }
    }
}
