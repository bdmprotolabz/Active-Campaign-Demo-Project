// Array to store created tags
let createdTags = [];

$(document).ready(function () {

    updateTagDropdown();
    const storedContactId = localStorage.getItem('contactId');

    if (storedContactId) {
        const elementIds = [
            '#contactId',
            '#contactIdDelete',
            '#tagContactId',
            '#removeTagContactId',
            '#updateCustomFieldContactId',
            '#contactDetailId',
            '#activityContactId'
        ];

        $(elementIds.join(',')).val(storedContactId).prop('readonly', true);
    }
});

// Create Contact
async function btnCreateContact() {
    // Get input values
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;

    // Validate inputs
    if (!email || !firstName || !lastName || !phone) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'All fields are required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        const response = await fetch('/api/ManageContact/CreateContact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName, phone })
        });

        const data = await response.json();

        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Contact created successfully!',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Store the contact ID and populate the update form
                const contactId = data.id; // Assuming the response has the contact ID as 'id'

                // Store the contact ID in localStorage for later use (page reload)
                localStorage.setItem('contactId', contactId);

                // Set the contact ID in the update form input
                document.getElementById('contactId').value = contactId; // Set value to the input field
                document.getElementById('contactId').readOnly = true; // Set the field as readonly to prevent editing


                document.getElementById('contactIdDelete').value = contactId; // Fill the input with stored contactId
                document.getElementById('contactIdDelete').readOnly = true; //



                document.getElementById('tagContactId').value = contactId; // Fill the input with stored contactId
                document.getElementById('tagContactId').readOnly = true; //

                document.getElementById('removeTagContactId').value = contactId; // Fill the input with stored contactId
                document.getElementById('removeTagContactId').readOnly = true; //

                document.getElementById('updateCustomFieldContactId').value = contactId; 
                document.getElementById('updateCustomFieldContactId').readOnly = true; //


                document.getElementById('contactDetailId').value = contactId;
                document.getElementById('contactDetailId').readOnly = true; //


                document.getElementById('activityContactId').value = contactId;
                document.getElementById('activityContactId').readOnly = true; //


                


                // Clear the create contact form
                document.getElementById('email').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('phone').value = '';
            });
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Update Contact
async function btnUpdateContact() {
    const contactId = document.getElementById('contactId').value;
    const email = document.getElementById('updatedEmail').value;
    const firstName = document.getElementById('updatedFirstName').value;
    const lastName = document.getElementById('updatedLastName').value;
    const phone = document.getElementById('updatedPhone').value;

    // Validate inputs
    if (!contactId || !email || !firstName || !lastName || !phone) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'All fields are required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    const contact = {
        Id: contactId,
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        Phone: phone
    };

    try {
        const response = await fetch(`/api/ManageContact/UpdateContact/${contactId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });

        const data = await response.json();

        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Contact updated successfully!',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Clear the form after successful update
                document.getElementById('updatedEmail').value = '';
                document.getElementById('updatedFirstName').value = '';
                document.getElementById('updatedLastName').value = '';
                document.getElementById('updatedPhone').value = '';
            });
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Delete Contact
async function btnDeleteContact() {
    const contactId = document.getElementById('contactIdDelete').value || localStorage.getItem('contactId'); // Get contactId from input or localStorage

    // Validate if contactId is available
    if (!contactId) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Contact ID is required to delete a contact!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        const response = await fetch(`/api/ManageContact/DeleteContact/${contactId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok && data.message) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message, // Displaying message from the API response
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Remove the contactId from localStorage after deletion
                localStorage.removeItem('contactId');

                // Clear the form fields
                document.getElementById('contactIdDelete').value = '';
            });
        } else {
            throw new Error(data.message || 'An error occurred.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to create a new tag
async function btnCreateTag() {
    const tagName = document.getElementById('tagName').value;

    if (!tagName) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tag Name is required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        const response = await fetch('/api/ManageTag/CreateTag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: tagName })
        });

        const data = await response.json();

        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Tag created successfully!',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Add created tag to the createdTags array
                createdTags.push({ Id: data.tagId, Name: tagName });

                // Clear the input field after successful tag creation
                document.getElementById('tagName').value = '';

                // Update the dropdown with new tags
                updateTagDropdown();
            });
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to update the dropdown for selecting tags
function updateTagDropdown() {
    const tagSelect = document.getElementById('tagSelect');
    tagSelect.innerHTML = ''; // Clear existing options

    // Create and append a default "Select Tags" option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select Tags';
    defaultOption.value = '';
    tagSelect.appendChild(defaultOption);

    // Loop through createdTags array and populate the dropdown
    createdTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.Id;  // Set tag ID as the value of the option
        option.text = tag.Name; // Set tag name as the display text
        tagSelect.appendChild(option); // Append option to the dropdown
    });

    // Additional logic to handle Remove Tag dropdown:
    // If there are tags available, the user will be able to remove selected tags.
    // The dropdown for removing tags will display the same tags as the one for adding tags.
    const removeTagSelect = document.getElementById('tagNameToRemove');
    removeTagSelect.innerHTML = ''; // Clear existing options

    // Add the same "Select Tags" default option to the Remove Tag dropdown
    const removeDefaultOption = document.createElement('option');
    removeDefaultOption.text = 'Select Tags to Remove';
    removeDefaultOption.value = '';
    removeTagSelect.appendChild(removeDefaultOption);

    // Populate the remove tag dropdown with the tags from createdTags
    createdTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.Id;  // Set tag ID as the value of the option
        option.text = tag.Name; // Set tag name as the display text
        removeTagSelect.appendChild(option); // Append option to the dropdown
    });
}

// Add Tag to Existing Contact
async function btnAddTagToContact() {
    const contactId = document.getElementById('tagContactId').value;
    const selectedTags = Array.from(document.getElementById('tagSelect').selectedOptions)
        .map(option => option.value); // Get selected tag IDs

    if (!contactId || selectedTags.length === 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Both Contact ID and at least one tag are required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        const response = await fetch('/api/ManageTag/AddTagToContact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ContactId: contactId, TagIds: selectedTags })
        });

        const data = await response.json();

        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Tags added to contact successfully!',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Clear the form after successful tag addition
                document.getElementById('tagContactId').value = '';
                document.getElementById('tagSelect').selectedIndex = -1; // Deselect all tags
            });
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Remove Tag(s) from Existing Contact
async function btnRemoveTagFromContact() {
    const contactId = document.getElementById('removeTagContactId').value;
    const tagIdsToRemove = Array.from(document.getElementById('tagNameToRemove').selectedOptions)
        .map(option => option.value); // Get the selected tag IDs from the dropdown

    // Validate inputs
    if (!contactId || tagIdsToRemove.length === 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Contact ID and at least one Tag are required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        // Prepare request payload for multiple tag removal
        const requestBody = {
            ContactId: contactId,
            TagIds: tagIdsToRemove.map(tag => parseInt(tag.trim())) // Convert each tag ID to number
        };

        // Make the API call to remove the tags from the contact
        const response = await fetch('/api/ManageTag/RemoveTagFromContact', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Tag(s) removed from contact successfully!',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Reset the form after successful tag removal
                document.getElementById('removeTagContactId').value = '';
                document.getElementById('tagNameToRemove').selectedIndex = -1; // Reset dropdown selection
            });
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to toggle visibility of the options input field
function toggleOptionsInput() {
    const fieldType = document.getElementById('customFieldType').value;
    const optionsContainer = document.getElementById('optionsContainer');

    // Show options input for dropdown, multiselect, and radio field types
    if (fieldType === 'dropdown' || fieldType === 'multiselect' || fieldType === 'radio') {
        optionsContainer.style.display = 'block';
    } else {
        optionsContainer.style.display = 'none';
    }
}

// create custom field
async function btnCreateCustomField() {
    const customFieldName = document.getElementById('customFieldName').value;
    const customFieldType = document.getElementById('customFieldType').value;
    const customFieldDescription = document.getElementById('customFieldDescription').value;
    const customFieldOptions = document.getElementById('customFieldOptions') ? document.getElementById('customFieldOptions').value : '';

    // Prepare the data object
    const fieldData = {
        title: customFieldName,
        type: customFieldType,
        description: customFieldDescription,
        options: []  // Default empty array for options
    };

    // Handle options if field type is dropdown, multiselect, or radio
    if (customFieldType === 'dropdown' || customFieldType === 'multiselect' || customFieldType === 'radio') {
        // Check if options are provided
        if (!customFieldOptions.trim()) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Options are required!',
                timer: 3000,
                showConfirmButton: false
            });
        }

        // Convert options to an array by splitting the input string (comma separated)
        fieldData.options = customFieldOptions.split(',').map(option => option.trim());
    }

    try {
        // Send the request to create the custom field
        const response = await fetch('/api/ManageCustomField/CreateCustomField', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fieldData)  // Send data directly without wrapping in 'field'
        });

        const data = await response.json();

        // Check if the response is successful
        if (response.ok && data.ret === 1) {
            // Clear the form fields after success
            document.getElementById('customFieldName').value = '';
            document.getElementById('customFieldType').value = '';
            document.getElementById('customFieldDescription').value = '';
            document.getElementById('customFieldOptions').value = '';

            // Set the created custom field ID into the update form input box
            document.getElementById('updateCustomFieldCustomFieldId').value = data.customFieldId; // Assuming the response includes customFieldId


            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Custom field created successfully!',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        // Handle error and display message
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

//update customfield
async function btnUpdateCustomField() {
    const contactId = document.getElementById('updateCustomFieldContactId').value;
    const customFieldId = document.getElementById('updateCustomFieldCustomFieldId').value;
    const customFieldValue = document.getElementById('updateCustomField').value;

    // Validate form data
    if (!contactId || !customFieldId || !customFieldValue) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'All fields are required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    // Prepare the data object to be sent to the API
    const fieldData = {
        contactId: contactId,
        customFieldId: customFieldId,
        value: customFieldValue
    };

    try {
        // Send the request to update the custom field value
        const response = await fetch('/api/ManageCustomField/UpdateCustomFieldValue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fieldData)
        });

        const data = await response.json();

        // Handle success or error based on the API response
        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Custom field value updated successfully!',
                timer: 3000,
                showConfirmButton: false
            });

            // Clear the form after success
            document.getElementById('updateCustomFieldForm').reset();
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        // Handle error and display message
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

//update customfield
async function btnUpdateCustomField() {
    const contactId = document.getElementById('updateCustomFieldContactId').value;
    const customFieldId = document.getElementById('updateCustomFieldCustomFieldId').value;
    const customFieldValue = document.getElementById('updateCustomField').value;

    // Validate form data
    if (!contactId || !customFieldId || !customFieldValue) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'All fields are required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    // Prepare the data object to be sent to the API
    const fieldData = {
        contactId: contactId,
        customFieldId: customFieldId,
        value: customFieldValue
    };

    try {
        // Send the request to update the custom field value
        const response = await fetch('/api/ManageCustomField/UpdateCustomFieldValue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fieldData)
        });

        const data = await response.json();

        // Handle success or error based on the API response
        if (response.ok && data.ret === 1) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Custom field value updated successfully!',
                timer: 3000,
                showConfirmButton: false
            });

            // Clear the form after success
            document.getElementById('updateCustomFieldForm').reset();
        } else {
            throw new Error(data.responseMessage || 'An error occurred.');
        }
    } catch (error) {
        // Handle error and display message
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to fetch contact details by contact ID
async function getContactById(contactId) {
    // If no contactId is provided as a parameter, try to fetch it from localStorage
    if (!contactId) {
        contactId = localStorage.getItem('contactId');
        if (!contactId) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Contact ID is required!',
                timer: 3000,
                showConfirmButton: false
            });
        }
    }

    try {
        const response = await fetch(`/api/ManageContact/GetContactById/${contactId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Contact not found');
        }

        const data = await response.json();

        // Assuming data contains the contact details
        if (data) {
            document.getElementById('contactDetailId').value = data.contact.id || '';
            document.getElementById('contactDetailId').readOnly = true;

            document.getElementById('email').value = data.contact.email || '';
            document.getElementById('firstName').value = data.contact.firstName || '';
            document.getElementById('lastName').value = data.contact.lastName || '';
            document.getElementById('phone').value = data.contact.phone || '';

            // Bind data to the table
            const tableBody = document.getElementById('contactTable').getElementsByTagName('tbody')[0];
            // Clear previous rows
            tableBody.innerHTML = '';

            // Create a new row for the fetched data
            const newRow = tableBody.insertRow();

            // Insert cells and add data into them
            const cell1 = newRow.insertCell(0); // Contact ID
            cell1.textContent = data.contact.id || '';

            const cell2 = newRow.insertCell(1); // Name
            cell2.textContent = `${data.contact.firstName || ''} ${data.contact.lastName || ''}`;

            const cell3 = newRow.insertCell(2); // Email
            cell3.textContent = data.contact.email || '';

            const cell4 = newRow.insertCell(3); // Tags (Assuming tags are an array of objects)
            if (data.contact.tags && data.contact.tags.length > 0) {
                // Map through each tag and add "Tag: " before each tag name
                const tagNames = data.contact.tags.map(tag => `Tag: ${tag.name}`).join(', ');
                cell4.textContent = tagNames; // Display the formatted tag names
            } else {
                // Fallback message if no tags are available
                cell4.textContent = 'No tags';
            }

            const cell5 = newRow.insertCell(4); // Custom Fields (Assuming customFields is an array of objects)

            // Check if customFields exist and have data
            if (data.contact.customFields && data.contact.customFields.length > 0) {
                // Format and display custom fields with line breaks
                cell5.innerHTML = data.contact.customFields
                    .map(field => `Custom Field: ${field.title}, Value: ${field.value}`)
                    .join('<br>'); // Use <br> for HTML line breaks
            } else {
                // Display a fallback message if no custom fields are available
                cell5.textContent = 'No custom fields available';
            }


            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Contact details fetched successfully!',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: 'No contact found with this ID.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to fetch contacts modified since a specific date
async function getContactsByModifiedDate() {
    // If no modifiedSince date is provided, try to fetch it from localStorage
    // Get the date value from the input field
    const modifiedSince = document.getElementById('modifiedSince').value;

    // Validate if the date is provided
    if (!modifiedSince) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Modified date is required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        const response = await fetch(`/api/ManageContact/GetContactsByModifiedDate?modifiedSince=${encodeURIComponent(modifiedSince)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('No contacts found for the given date');
        }

        const data = await response.json();

        // Assuming data contains the list of contacts
        if (data.ret === 1 && data.contacts) {
            const tableBody = document.getElementById('contactsTable').getElementsByTagName('tbody')[0];
            // Clear previous rows
            tableBody.innerHTML = '';

            // Populate the table with the fetched contacts
            data.contacts.forEach(contact => {
                const newRow = tableBody.insertRow();

                const cell1 = newRow.insertCell(0); // Contact ID
                cell1.textContent = contact.id || '';

                const cell2 = newRow.insertCell(1); // Name
                cell2.textContent = `${contact.firstName || ''} ${contact.lastName || ''}`;

                const cell3 = newRow.insertCell(2); // Email
                cell3.textContent = contact.email || '';

                const cell4 = newRow.insertCell(3); // Phone
                cell4.textContent = contact.phone || '';

               
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Contacts fetched successfully!',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: data.responseMessage || 'No contacts found.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to search contacts by name or email
async function searchContacts() {
    const searchQuery = document.getElementById('searchQuery').value.trim();

    // Validate input
    if (!searchQuery) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Search query is required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        // API call to search contacts
        const response = await fetch(`/api/ManageContact/SearchContacts?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('No contacts found for the given query.');
        }

        const data = await response.json();

        if (data.ret === 1 && data.contacts) {
            const tableBody = document
                .getElementById('searchedcontactTable')
                .getElementsByTagName('tbody')[0];

            // Clear previous rows
            tableBody.innerHTML = '';

            // Populate the table with the fetched contacts
            data.contacts.forEach(contact => {
                const newRow = tableBody.insertRow();

                const cell1 = newRow.insertCell(0); // Contact ID
                cell1.textContent = contact.id || '';

                const cell2 = newRow.insertCell(1); // Name
                cell2.textContent = `${contact.firstName || ''} ${contact.lastName || ''}`;

                const cell3 = newRow.insertCell(2); // Email
                cell3.textContent = contact.email || '';

                const cell4 = newRow.insertCell(3); // Phone
                cell4.textContent = contact.phone || '';
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Contacts fetched successfully!',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: data.responseMessage || 'No contacts found.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to fetch activity for a contact by ID
async function getActivityForContact() {
    const contactId = document.getElementById('activityContactId').value.trim();

    // Validate input
    if (!contactId || isNaN(contactId) || contactId <= 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'A valid Contact ID is required!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        // Fetch activity for the given contact ID
        const response = await fetch(`/api/ManageContact/GetActivityForContact?contactId=${encodeURIComponent(contactId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('No activities found for this contact.');
        }

        const data = await response.json();

        const activityTableBody = document
            .getElementById('activityTable')
            .getElementsByTagName('tbody')[0];

        // Clear previous rows
        activityTableBody.innerHTML = '';

        if (data.ret === 1 && data.activities) {
            // Populate the table with the fetched activities
            data.activities.forEach(activity => {
                const newRow = activityTableBody.insertRow();

                const cell1 = newRow.insertCell(0); // Activity ID
                cell1.textContent = activity.id || '';

                const cell2 = newRow.insertCell(1); // Type
                cell2.textContent = activity.activityType || '';

                const cell3 = newRow.insertCell(2); // Description
                cell3.textContent = activity.description || '';

                const cell4 = newRow.insertCell(3); // Created Date
                cell4.textContent = activity.createdDate || '';
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Activities fetched successfully!',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'No Activities',
                text: 'No activities found for this contact.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}

// Function to fetch activity for a contact by daterange
async function getActivitiesByDateRange() {
    const startDate = document.getElementById('startDate').value.trim();
    const endDate = document.getElementById('endDate').value.trim();

    // Validate input
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please provide a valid date range!',
            timer: 3000,
            showConfirmButton: false
        });
    }

    try {
        // Make sure to send the parameters correctly
        const response = await fetch(`/api/ManageContact/GetActivitiesByDateRange?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('No activities found for the specified date range.');
        }

        const data = await response.json();

        const activityTableBody = document
            .getElementById('allActivityTable')
            .getElementsByTagName('tbody')[0];

        // Clear previous rows
        activityTableBody.innerHTML = '';

        if (data.ret === 1 && data.activities) {
            // Populate the table with the fetched activities
            data.activities.forEach(activity => {
                const newRow = activityTableBody.insertRow();

                const cell1 = newRow.insertCell(0); // Activity ID
                cell1.textContent = activity.id || '';

                const cell2 = newRow.insertCell(1); // Type
                cell2.textContent = activity.activityType || '';

                const cell3 = newRow.insertCell(2); // Description
                cell3.textContent = activity.description || '';

                const cell4 = newRow.insertCell(3); // Created Date
                cell4.textContent = activity.createdDate || '';
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Activities fetched successfully!',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'No Activities',
                text: 'No activities found for the specified date range.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Error: ${error.message}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}







