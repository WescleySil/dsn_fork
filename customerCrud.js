const apiData = document.querySelector('.dados'); // Selects the <tbody> element
const modal = document.getElementById('modal'); // Get the modal element
const modalClose = document.getElementById('modalClose'); // Get the close button
const modalForm = document.querySelector('.modal-form'); // Get the modal form
const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/customers';
// Function to fetch and display data from API
async function fetchData() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json(); // Assuming API returns JSON data

        // Access the array within the `data` property
        const customers = data.data; // Now `customers` is an array

        // Clear existing data in the table
        apiData.innerHTML = ''; // Clears the existing rows in the table

        // Iterate through the customers array
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.cpf}</td>
                <td>${customer.address}</td>
                <td>
                    <button type="button" class="button green" data-id="${customer.id}" onclick="editFunction(${customer.id})">editar</button>
                    <button type="button" class="button red" data-id="${customer.id}" onclick="deleteCustomer(${customer.id})">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to display an error message to the user here
    }
}

// Function to handle editing a customer (using PUT)
async function editFunction(customerId) {
    // 1. Get the customer data from the API
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/customers/${customerId}`;
        const response = await fetch(apiEndpoint);
        const customerData = await response.json(); 

        // 2. Populate the modal form with the customer data
        // Check if the elements exist before setting their values
        if (modalForm.querySelector('input[placeholder="Nome do Cliente"]')) {
            modalForm.querySelector('input[placeholder="Nome do Cliente"]').value = customerData.data.name;
        }
        if (modalForm.querySelector('input[placeholder="CPF do Cliente"]')) {
            modalForm.querySelector('input[placeholder="CPF do Cliente"]').value = customerData.data.cpf;
        }
        if (modalForm.querySelector('input[placeholder="Endereço do Cliente"]')) {
            modalForm.querySelector('input[placeholder="Endereço do Cliente"]').value = customerData.data.address;
        }

        // 3. Set the modal header to "Editar Cliente"
        modal.querySelector('.modal-header h2').textContent = "Editar Cliente";

        // 4. Update the "Salvar" button's onclick event to call updateCustomer
        modal.querySelector('.modal-footer .button.green').onclick = () => updateCustomer(customerId);

        // 5. Show the modal
        modal.classList.add('active');
    } catch (error) {
        console.error('Error fetching customer data:', error);
        // Handle the error (e.g., display an error message)
    }
}


// Function to update a customer (using PUT)
async function updateCustomer(customerId) {
    // 1. Get the updated customer data from the modal form
    const name = modalForm.querySelector('input[placeholder="Nome do Cliente"]').value;
    const cpf = modalForm.querySelector('input[placeholder="CPF do Cliente"]').value;
    const address = modalForm.querySelector('input[placeholder="Endereço do Cliente"]').value;

    // 2. Construct the updated customer data object
    const updatedCustomerData = { name, cpf, address };

    // 3. Send a PUT request to your API to update the customer data
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/customers/${customerId}`;
        const response = await fetch(apiEndpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCustomerData)
        });

        // 4. Handle the response from the API
        if (response.ok) {
            // Successful update
            fetchData(); // Refresh the table
            closeModal(); // Close the modal
        } else {
            // Handle the error (e.g., display an error message)
            console.error('Error updating customer:', response.status);
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        // Handle the error (e.g., display an error message)
    }
}

// Function to handle deleting a customer (using DELETE)
async function deleteCustomer(customerId) {
    // 1. Send a DELETE request to your API to delete the customer
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/customers/${customerId}`;
        const response = await fetch(apiEndpoint, { method: 'DELETE' });

        // 2. Handle the response from the API
        if (response.ok) {
            // Successful deletion
            location.reload(); // Refresh the page
        } else {
            // Handle the error (e.g., display an error message)
            console.error('Error deleting customer:', response.status);
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        // Handle the error (e.g., display an error message)
    }
}

// Function to close the modal
function closeModal() {
    modal.classList.remove('active');
}

// Event listener for the close button
modalClose.addEventListener('click', closeModal);

// Call the fetchData function to load data from the API
fetchData();

// ... (your existing code from the previous response)

// Function to open the modal for creating a new customer
function openNewCustomerModal() {
    // Clear the modal form fields
    modalForm.querySelector('input[placeholder="Nome do Cliente"]').value = '';
    modalForm.querySelector('input[placeholder="CPF do Cliente"]').value = '';
    modalForm.querySelector('input[placeholder="Endereço do Cliente"]').value = '';

    // Set the modal header to "Novo Cliente"
    modal.querySelector('.modal-header h2').textContent = "Novo Cliente";

    // Update the "Salvar" button's onclick event to call createNewCustomer
    modal.querySelector('.modal-footer .button.green').onclick = createNewCustomer;

    // Show the modal
    modal.classList.add('active');
}

// Function to create a new customer (using POST)
async function createNewCustomer() {
    // 1. Get the new customer data from the modal form
    const name = modalForm.querySelector('input[placeholder="Nome do Cliente"]').value;
    const cpf = modalForm.querySelector('input[placeholder="CPF do Cliente"]').value;
    const address = modalForm.querySelector('input[placeholder="Endereço do Cliente"]').value;

    // 2. Construct the new customer data object
    const newCustomerData = { name, cpf, address };

    // 3. Send a POST request to your API to create the new customer
    try {
        const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/customers';
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomerData)
        });

        // 4. Handle the response from the API
        if (response.ok) {
            // Successful creation
            fetchData(); // Refresh the table
            closeModal(); // Close the modal
        } else {
            // Handle the error (e.g., display an error message)
            const errorResponse = await response.json();
            // Access the error message based on the API's structure
            let errorMessage = errorResponse.errors[0].msg;
            if (typeof(errorMessage) === 'object' && errorMessage.Erro === "Já existe um cliente cadastrado com este CPF") {
                alert(errorMessage.Erro);
            } else {
                // Display the error message in a more user-friendly way
                alert(errorMessage);
            }
            // Display the error message in a more user-friendly way
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        // Handle the error (e.g., display an error message)
    }
}