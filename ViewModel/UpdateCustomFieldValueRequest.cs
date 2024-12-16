using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ActiveCampaignWrapperTest.ViewModel
{

    public class UpdateCustomFieldValueRequest
    {
        public long ContactId { get; set; }
        public long CustomFieldId { get; set; }
        public string Value { get; set; }
    }


    public class CustomFieldRequest
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        // Change Options to List<string> to handle multiple options
        public List<string> Options { get; set; } = new List<string>();

        public string Value { get; set; }
    }

}
