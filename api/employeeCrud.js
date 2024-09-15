const apiData = document.querySelector('.dados');
const modalForm = document.querySelector('.modal-form');
const modalClose = document.getElementById('modalClose');
const modal = document.getElementById('modal');

async function fetchData() {
    try {
        const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/employees';
        const response = await fetch(apiEndpoint);
        const data = await response.json(); // Assuming API returns JSON data
        console.log(data)
        // Access the array within the `data` property
        const employees = data.data; // Now `customers` is an array
      

        // Clear existing data in the table
        apiData.innerHTML = ''; // Clears the existing rows in the table

        // Iterate through the customers array
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.cpf}</td>
                <td>${employee.address}</td>
                <td>
                    <button type="button" class="button green" data-id="${employee.id}" onclick="editFunction(${employee.id})">editar</button>
                    <button type="button" class="button red" data-id="${employee.id}" onclick="deleteCustomer(${employee.id})">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to display an error message to the user here
    }
}

async function editFunction(employeeId) {
    // 1. Get the customer data from the API
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/employees/${employeeId}`;
        const response = await fetch(apiEndpoint);
        const employeeData = await response.json(); 
        console.log(employeeData.data)

        // 2. Populate the modal form with the customer data
        // Check if the elements exist before setting their values
        if (modalForm.querySelector('input[placeholder="Nome do funcionario"]')) {
            modalForm.querySelector('input[placeholder="Nome do funcionario"]').value = employeeData.data.name;
        }
        if (modalForm.querySelector('input[placeholder="CPF do funcionario"]')) {
            modalForm.querySelector('input[placeholder="CPF do funcionario"]').value = employeeData.data.cpf;
        }
        if (modalForm.querySelector('input[placeholder="Endereço do funcionario"]')) {
            modalForm.querySelector('input[placeholder="Endereço do funcionario"]').value = employeeData.data.address;
        }
        if (modalForm.querySelector('input[placeholder="Celular do funcionario"]')) {
            modalForm.querySelector('input[placeholder="Celular do funcionario"]').value = employeeData.data.phone;
        }

        // 3. Set the modal header to "Editar Cliente"
        modal.querySelector('.modal-header h2').textContent = "Editar Funcionario";

        // 4. Update the "Salvar" button's onclick event to call updateCustomer
        modal.querySelector('.modal-footer .button.green').onclick = () => updateCustomer(employeeId);

        // 5. Show the modal
        modal.classList.add('active');
    } catch (error) {
        console.error('Error fetching customer data:', error);
        // Handle the error (e.g., display an error message)
    }
}

async function updateCustomer(employeeId) {
    // 1. Get the updated customer data from the modal form
    const name = modalForm.querySelector('input[placeholder="Nome do funcionario"]').value;
    const cpf = modalForm.querySelector('input[placeholder="CPF do funcionario"]').value;
    const address = modalForm.querySelector('input[placeholder="Endereço do funcionario"]').value;
    const phone = modalForm.querySelector('input[placeholder="Celular do funcionario"]').value;

    // 2. Construct the updated customer data object
    const updatedCustomerData = { name, cpf, address, phone };

    // 3. Send a PUT request to your API to update the customer data
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/employees/${employeeId}`;
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

async function deleteCustomer(employeeId) {
    // 1. Send a DELETE request to your API to delete the customer
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/employees/${employeeId}`;
        const response = await fetch(apiEndpoint, { method: 'DELETE' });

        // 2. Handle the response from the API
        if (response.ok) {
            // Successful deletion
            // location.reload(); // Refresh the page
            alert("Funcionário deletado com sucesso!");
            fetchData(); // Refresh the table
        } else {
            // Handle the error (e.g., display an error message)
            console.error('Error deleting customer:', response.status);
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        // Handle the error (e.g., display an error message)
    }
}

function closeModal() {
    modal.classList.remove('active');
}

function openNewEmployeeModal() {
    // Clear the modal form fields
    modalForm.querySelector('input[placeholder="Nome do funcionario"]').value = '';
    modalForm.querySelector('input[placeholder="CPF do funcionario"]').value = '';
    modalForm.querySelector('input[placeholder="Endereço do funcionario"]').value = '';
    modalForm.querySelector('input[placeholder="Celular do funcionario"]').value = '';

    // Set the modal header to "Novo funcionario"
    modal.querySelector('.modal-header h2').textContent = "Novo funcionario";

    // Update the "Salvar" button's onclick event to call createNewCustomer
    modal.querySelector('.modal-footer .button.green').onclick = createNewEmployee;

    // Show the modal
    modal.classList.add('active');
}

async function createNewEmployee() {
    // 1. Selecionar o modal e verificar se ele está corretamente definido
    const modalForm = document.querySelector('.modal-form'); // Certifique-se que esse seletor está correto
    if (!modalForm) {
        console.error('modalForm not found!');
        return;
    }
    
    const name = modalForm.querySelector('input[placeholder="Nome do funcionario"]').value;
    const cpf = modalForm.querySelector('input[placeholder="CPF do funcionario"]').value;
    const address = modalForm.querySelector('input[placeholder="Endereço do funcionario"]').value;
    const phone = modalForm.querySelector('input[placeholder="Celular do funcionario"]').value;


    console.log(name); // Verifique se os dados são recuperados corretamente

    // 3. Criar o objeto com os dados do novo funcionário
    const newEmployeeData = { name, cpf, address, phone };

    // 4. Enviar a requisição POST à API
    try {
        const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/employees';
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmployeeData)
        });

        if (response.ok) {
            // Sucesso ao criar
            fetchData(); // Atualiza a tabela
            closeModal(); // Fecha o modal
        } else {
            // Lida com erro (exibe a mensagem de erro)
            const errorResponse = await response.json();
            let errorMessage = errorResponse.errors[0].msg;
            if (typeof(errorMessage) === 'object' && errorMessage.Erro === "Já existe um funcionario cadastrado com este CPF") {
                alert(errorMessage.Erro);
            } else {
                alert(errorMessage);
            }
        }
    } catch (error) {
        console.error('Error creating customer:', error);
    }
}


fetchData();
