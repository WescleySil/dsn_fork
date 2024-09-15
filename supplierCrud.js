const apiData = document.querySelector('.dados'); // Selects the <tbody> element
const modal = document.getElementById('modal'); // Get the modal element
const modalClose = document.getElementById('modalClose'); // Get the close button
const modalForm = document.querySelector('.modal-form'); // Get the modal form
const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/suppliers';

async function fetchData() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json(); // Assuming API returns JSON data

        // Access the array within the `data` property
        const suppliers = data.data; // Now `suppliers` is an array

        // Clear existing data in the table
        apiData.innerHTML = ''; // Clears the existing rows in the table

        // Iterate through the suppliers array
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone}</td>
                <td>
                    <button type="button" class="button green" data-id="${supplier.id}" onclick="editFunction(${supplier.id})">editar</button>
                    <button type="button" class="button red" data-id="${supplier.id}" onclick="deleteSupplier(${supplier.id})">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to display an error message to the user here
    }
}

async function editFunction(supplierId) {
    // 1. Get the customer data from the API
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/suppliers/${supplierId}`;
        const response = await fetch(apiEndpoint);
        const supplierData = await response.json(); 

        // 2. Populate the modal form with the customer data
        // Check if the elements exist before setting their values
        if (modalForm.querySelector('input[placeholder="Nome do fornecedor"]')) {
            modalForm.querySelector('input[placeholder="Nome do fornecedor"]').value = supplierData.data.name;
        }
        if (modalForm.querySelector('input[placeholder="email do fornecedor"]')) {
            modalForm.querySelector('input[placeholder="email do fornecedor"]').value = supplierData.data.email;
        }
        if (modalForm.querySelector('input[placeholder="telefone do fornecedor"]')) {
            modalForm.querySelector('input[placeholder="telefone do fornecedor"]').value = supplierData.data.phone;
        }

        // 3. Set the modal header to "Editar Cliente"
        modal.querySelector('.modal-header h2').textContent = "Editar Cliente";

        // 4. Update the "Salvar" button's onclick event to call updateCustomer
        modal.querySelector('.modal-footer .button.green').onclick = () => updateSupplier(supplierId);

        // 5. Show the modal
        modal.classList.add('active');
    } catch (error) {
        console.error('Error fetching customer data:', error);
        // Handle the error (e.g., display an error message)
    }
}

async function updateSupplier(supplierId) {
    const name = modalForm.querySelector('input[placeholder="Nome do fornecedor"]').value;
    const email = modalForm.querySelector('input[placeholder="email do fornecedor"]').value;
    const phone = modalForm.querySelector('input[placeholder="telefone do fornecedor"]').value;

    const updatedSupplierData = { name, email, phone };

    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/suppliers/${supplierId}`;
        const response = await fetch(apiEndpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSupplierData)
        });

        if (response.ok) {
            fetchData(); 
            closeModal(); 
        } else {
            console.error('Error updating supplier:', response.status);
        }
    } catch (error) {
        console.error('Error updating supplier:', error);
    }
}

async function deleteSupplier(supplierId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/suppliers/${supplierId}`;
        const response = await fetch(apiEndpoint, { method: 'DELETE' });

        if (response.ok) {
            alert("Fornecedor deletado com sucesso!");
            fetchData();
        } else {
            console.error('Error deleting supplier:', response.status);
        }
    } catch (error) {
        console.error('Error deleting suppliers:', error);
    }
}

function closeModal() {
    modal.classList.remove('active');
}

modalClose.addEventListener('click', closeModal);

fetchData();

function openNewSupplierModal() {
    modalForm.querySelector('input[placeholder="Nome do fornecedor"]').value = '';
    modalForm.querySelector('input[placeholder="email do fornecedor"]').value = '';
    modalForm.querySelector('input[placeholder="telefone do fornecedor"]').value = '';

    // Set the modal header to "Novo Cliente"
    modal.querySelector('.modal-header h2').textContent = "Novo fornecedor";

    // Update the "Salvar" button's onclick event to call createNewSupplier
    modal.querySelector('.modal-footer .button.green').onclick = createNewSupplier;

    // Show the modal
    modal.classList.add('active');
}

async function createNewSupplier() {
    // 1. Get the new customer data from the modal form
    const name = modalForm.querySelector('input[placeholder="Nome do fornecedor"]').value;
    const email = modalForm.querySelector('input[placeholder="email do fornecedor"]').value;
    const phone = modalForm.querySelector('input[placeholder="telefone do fornecedor"]').value;

    // 2. Construct the new customer data object
    const newSupplierData = { name, email, phone };

    // 3. Send a POST request to your API to create the new customer
    try {
        const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/suppliers';
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSupplierData)
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
            alert(errorMessage);
            
        }
    } catch (error) {
        console.error('Error creating supplier:', error);
        
    }
}