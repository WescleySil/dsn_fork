const apiData = document.querySelector('.dados'); // Selects the <tbody> element

// Function to fetch and display data from API
async function fetchData() {
    try {
        const apiEndpoint = 'https://api-cyber-market-js.onrender.com/api/customers';
        const response = await fetch(apiEndpoint);
        const data = await response.json(); // Assuming API returns JSON data

        // Access the array within the `data` property
        const customers = data.data; // Now `customers` is an array

        // Iterate through the customers array
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.cpf}</td>
                <td>${customer.address}</td>
                <td>
                    <button type="button" class="button green">editar</button>
                    <button type="button" class="button red">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to display an error message to the user here
    }
}

// Call the fetchData function to load data from the API
fetchData();

// Mock data (for preview)
// const clientes = [
//     { nome: "Maria", cpf: "123.456.789-00", endereco: "Rua A, 123" },
//     { nome: "João Pedro", cpf: "987.654.321-00", endereco: "Rua B, 456" },
//     { nome: "José da Silva", cpf: "111.222.333-00", endereco: "Rua C, 789" }
// ];

// // Iterate through the mock data and create table rows
// clientes.forEach(cliente => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//         <td>${cliente.nome}</td>
//         <td>${cliente.cpf}</td>
//         <td>${cliente.endereco}</td>
//         <td>
//             <button type="button" class="button green">editar</button>
//             <button type="button" class="button red">excluir</button>
//         </td>
//     `;
//     apiData.appendChild(row);
// });