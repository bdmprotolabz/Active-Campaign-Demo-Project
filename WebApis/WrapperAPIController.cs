using ActiveCampaignAPIWrapper.Authentication;
using ActiveCampaignAPIWrapper.Helpers;
using ActiveCampaignAPIWrapper.Models;
using ActiveCampaignAPIWrapper.Services;
using ActiveCampaignWrapperTest.ViewModel;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;
using static System.Formats.Asn1.AsnWriter;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.IO;
using System.Net;
using System.Resources;

namespace ActiveCampaignWrapperTest.WebApis
{

    public class WrapperAPIController : ControllerBase
    {

        private readonly ContactService _contactService;
        private readonly CustomFieldService _customFieldService;
        private readonly TagService _tagService;

        public WrapperAPIController(ActiveCampaignClient client)
        {

            _contactService = new ContactService(client); // Create an instance of your wrapper class
            _customFieldService = new CustomFieldService(client);
            _tagService = new TagService(client);
        }

        [HttpPost]
        [Route("api/ManageContact/CreateContact")]
        public async Task<IActionResult> CreateContact([FromBody] Contact contact)
        {
            if (string.IsNullOrWhiteSpace(contact.Email) || string.IsNullOrWhiteSpace(contact.FirstName) || string.IsNullOrWhiteSpace(contact.LastName) || string.IsNullOrWhiteSpace(contact.Phone))
            {
                return BadRequest(new { ret = 0, responseMessage = "All fields are required." });
            }

            try
            {
                var response = await _contactService.CreateContactAsync(contact);

                if (response.ret == 1)
                    return Ok(new { ret = 1, Id = response.Id });
                else
                    return BadRequest(new { ret = 0, responseMessage = response.responseMessage });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }
        }

        [HttpPut]
        [Route("api/ManageContact/UpdateContact/{id}")]
        public async Task<IActionResult> UpdateContact(int id, [FromBody] Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest(new { ret = 0, responseMessage = "Contact ID mismatch" });
            }

            try
            {
                var response = await _contactService.UpdateContactAsync(contact);

                if (response.ret == 1)
                    return Ok(new { ret = 1, responseMessage = "Contact updated successfully" });
                else
                    return BadRequest(new { ret = 0, responseMessage = response.responseMessage });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }
        }

        // DELETE Contact API Endpoint
        [HttpDelete("api/ManageContact/DeleteContact/{contactId}")]
        public async Task<IActionResult> DeleteContact(long contactId)
        {
            // Call the DLL method to delete contact
            var result = await _contactService.DeleteContactAsync(contactId);

            if (result.ret == 1)
            {
                // Return a success response
                return Ok(new { message = result.responseMessage });
            }
            else
            {
                // Return an error response
                return BadRequest(new { message = result.responseMessage });
            }
        }

        // Create Tag API Endpoint
        [HttpPost]
        [Route("api/ManageTag/CreateTag")]
        public async Task<IActionResult> CreateTag([FromBody] Tag tag)
        {
            if (tag == null || string.IsNullOrWhiteSpace(tag.Name))
            {
                return BadRequest(new { ret = 0, responseMessage = "Tag name is required." });
            }

            try
            {
                var result = await _tagService.CreateTagAsync(tag);

                if (result.ret == 1)
                {
                    return Ok(new { ret = 1, tagId = tag.Id, responseMessage = result.responseMessage });
                }
                else
                {
                    return BadRequest(new { ret = 0, responseMessage = result.responseMessage });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }
        }

        // Add Tag to Contact API Endpoint
        [HttpPost]
        [Route("api/ManageTag/AddTagToContact")]
        public async Task<IActionResult> AddTagToContact([FromBody] AddTagRequest request)
        {
            if (request == null || request.ContactId == 0 || request.TagIds == null || !request.TagIds.Any())
            {
                return BadRequest(new { ret = 0, responseMessage = "Both Contact ID and at least one Tag ID are required." });
            }

            try
            {
                // Use TagIds instead of TagId
                var result = await _tagService.AddTagToContactAsync(request.ContactId, request.TagIds);

                if (result.ret == 1)
                {
                    return Ok(new { ret = 1, responseMessage = result.responseMessage });
                }
                else
                {
                    return BadRequest(new { ret = 0, responseMessage = result.responseMessage });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }
        }
          
        // Remove Tag from Contact API Endpoint
        [HttpDelete]
        [Route("api/ManageTag/RemoveTagFromContact")]
        public async Task<IActionResult> RemoveTagFromContact([FromBody] AddTagRequest request)
        {
            if (request == null || request.ContactId == 0 || request.TagIds == null || !request.TagIds.Any())
            {
                return BadRequest(new { ret = 0, responseMessage = "Both Contact ID and at least one Tag ID are required." });
            }

            try
            {
                var result = await _tagService.RemoveTagFromContactAsync(request.ContactId, request.TagIds);

                if (result.ret == 1)
                {
                    return Ok(new { ret = 1, responseMessage = result.responseMessage });
                }
                else
                {
                    return BadRequest(new { ret = 0, responseMessage = result.responseMessage });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }
        }

        [HttpPost]
        [Route("api/ManageCustomField/CreateCustomField")]
        public async Task<IActionResult> CreateCustomField([FromBody] CustomFieldRequest customFieldRequest)
        {
            if (customFieldRequest == null)
            {
                return BadRequest(new { ret = 0, responseMessage = "Custom field details are required." });
            }

            // Validate required fields
            if (string.IsNullOrEmpty(customFieldRequest.Title))
            {
                return BadRequest(new { ret = 0, responseMessage = "Custom field title is required." });
            }

            if (string.IsNullOrEmpty(customFieldRequest.Type))
            {
                return BadRequest(new { ret = 0, responseMessage = "Custom field type is required." });
            }

            // Handle validation for options based on type
            if ((customFieldRequest.Type == "dropdown" || customFieldRequest.Type == "multiselect" || customFieldRequest.Type == "radio") &&
                (customFieldRequest.Options == null || customFieldRequest.Options.Count == 0))
            {
                return BadRequest(new { ret = 0, responseMessage = "Options are required for dropdown, multiselect, or radio field types." });
            }

            try
            {
                // Convert CustomFieldRequest to CustomField (for service method compatibility)
                CustomField customFieldModel = new CustomField
                {
                    Id = customFieldRequest.Id,
                    Title = customFieldRequest.Title,
                    Type = customFieldRequest.Type,
                    Description = customFieldRequest.Description,
                    Options = customFieldRequest.Options != null ? string.Join(",", customFieldRequest.Options) : string.Empty, // Convert list to comma-separated string
                    Value = customFieldRequest.Value
                };

                // Call the service method to create the custom field
                var result = await _customFieldService.CreateCustomFieldAsync(customFieldModel);

                if (result.ret == 1)
                {
                    return Ok(new
                    {
                        ret = 1,
                        customFieldId = customFieldModel.Id,
                        responseMessage = result.responseMessage
                    });
                }
                else
                {
                    return BadRequest(new { ret = 0, responseMessage = result.responseMessage });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }   
        }

        [HttpPost]
        [Route("api/ManageCustomField/UpdateCustomFieldValue")]
        public async Task<IActionResult> UpdateCustomFieldValue([FromBody] UpdateCustomFieldValueRequest request)
        {
            if (request == null || request.ContactId <= 0 || request.CustomFieldId <= 0 || string.IsNullOrEmpty(request.Value))
            {
                return BadRequest(new { ret = 0, responseMessage = "Contact ID, Custom Field ID, and Value are required." });
            }

            try
            {
                var result = await _customFieldService.UpdateCustomFieldValueAsync(request.ContactId, request.CustomFieldId, request.Value);

                if (result.ret == 1)
                {
                    return Ok(new
                    {
                        ret = 1,
                        responseMessage = result.responseMessage
                    });
                }
                else
                {
                    return BadRequest(new { ret = 0, responseMessage = result.responseMessage });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = "Error: " + ex.Message });
            }
        }

        [HttpGet]
        [Route("api/ManageContact/GetContactById/{contactId}")]
        public async Task<IActionResult> GetContactByIdAsync(long contactId)
        {
            try
            {
                // Fetch the contact by ID along with its tags and custom fields
                var contact = await _contactService.GetContactByIdAsync
                    (contactId);

                if (contact == null)
                {
                    return NotFound(new { ret = 0, responseMessage = "Contact not found." });
                }

                return Ok(new
                {
                    ret = 1,
                    contact = contact
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = $"Error: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("api/ManageContact/GetContactsByModifiedDate")]
        public async Task<IActionResult> GetContactsByModifiedDateAsync([FromQuery] DateTime modifiedSince)
        {
            try
            {
                // Fetch contacts modified after the specified date
                var contacts = await _contactService.GetContactsByModifiedDateAsync(modifiedSince);

                if (contacts == null || !contacts.Any())
                {
                    return NotFound(new { ret = 0, responseMessage = "No contacts found for the given modified date." });
                }

                return Ok(new
                {
                    ret = 1,
                    contacts = contacts
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = $"Error: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("api/ManageContact/SearchContacts")]
        public async Task<IActionResult> SearchContacts(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { ret = 0, responseMessage = "Search query is required." });
            }

            try
            {
                var contacts = await _contactService.SearchContactsAsync(query);

                if (contacts.Count == 0)
                {
                    return NotFound(new { ret = 0, responseMessage = "No contacts found." });
                }

                return Ok(new { ret = 1, contacts });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = $"An error occurred: {ex.Message}" });
            }
        }

        // API method to get activities for a contact
        [HttpGet]
        [Route("api/ManageContact/GetActivityForContact")]
        public async Task<IActionResult> GetActivityForContact([FromQuery] long contactId)
        {
            if (contactId <= 0)
            {
                return BadRequest(new { ret = 0, responseMessage = "Contact ID is required and must be valid." });
            }

            try
            {
                var activities = await _contactService.GetActivityForContactAsync(contactId);

                if (activities == null || !activities.Any())
                {
                    return NotFound(new { ret = 0, responseMessage = "No activities found for this contact." });
                }

                return Ok(new { ret = 1, activities });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = $"An error occurred: {ex.Message}" });
            }
        }

        // API method to get activities for all contacts by date range
        [HttpGet]
        [Route("api/ManageContact/GetActivitiesByDateRange")]
        public async Task<IActionResult> GetActivitiesByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Validate dates
            if (startDate == default || endDate == default || endDate < startDate)
            {
                return BadRequest(new { ret = 0, responseMessage = "Invalid date range provided." });
            }

            try
            {
                var activities = await _contactService.GetActivityForAllContactsByDateRangeAsync(startDate, endDate);

                if (activities == null || !activities.Any())
                {
                    return NotFound(new { ret = 0, responseMessage = "No activities found for the specified date range." });
                }
                return Ok(new { ret = 1, activities });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ret = 0, responseMessage = $"An error occurred: {ex.Message}" });
            }
        }

    }

}




