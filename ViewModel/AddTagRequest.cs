using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ActiveCampaignWrapperTest.ViewModel
{
  
    public class AddTagRequest
    {
        public long ContactId { get; set; }
        public List<long> TagIds { get; set; }
    }
}
