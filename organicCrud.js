const apiData = document.querySelector(".dados"); // Selects the <tbody> element
const modal = document.getElementById("modal"); // Get the modal element
const modalClose = document.getElementById("modalClose"); // Get the close button
const modalForm = document.querySelector(".modal-form"); // Get the modal form
const apiEndpoint =
    "https://api-cyber-market-js.onrender.com/api/organic_compounds";

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

function reverseFormatDate(dateString) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
}

async function fetchData() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json(); // Assuming API returns JSON data

        // Access the array within the `data` property
        const organics = data.data; // Now `organics` is an array

        // Clear existing data in the table
        apiData.innerHTML = ""; // Clears the existing rows in the table

        // Iterate through the organics array
        organics.forEach((organic) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${organic.name}</td>
                <td>${organic.barcode}</td>
                <td>${organic.expiration_date}</td>
                <td>
                    <button type="button" class="button green" data-id="${organic.id}" onclick="editFunction(${organic.id})">editar</button>
                    <button type="button" class="button red" data-id="${organic.id}" onclick="deleteSupplier(${organic.id})">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to display an error message to the user here
    }
}

async function editFunction(organicId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/organic_compounds/${organicId}`;
        const response = await fetch(apiEndpoint);
        const organicData = await response.json();

        if (modalForm.querySelector('input[placeholder="Nome do organico"]')) {
            modalForm.querySelector(
                'input[placeholder="Nome do organico"]',
            ).value = organicData.data.name;
        }
        if (modalForm.querySelector('input[placeholder="Codigo de barras"]')) {
            modalForm.querySelector(
                'input[placeholder="Codigo de barras"]',
            ).value = organicData.data.barcode;
        }
        if (modalForm.querySelector('input[placeholder="Data de validade"]')) {
            modalForm.querySelector(
                'input[placeholder="Data de validade"]',
            ).value = reverseFormatDate(organicData.data.expiration_date);
        }

        modal.querySelector(".modal-header h2").textContent = "Editar Organico";

        modal.querySelector(".modal-footer .button.green").onclick = () =>
            updateOrganic(organicId);

        modal.classList.add("active");
    } catch (error) {
        console.error("Error fetching organic data:", error);
    }
}

async function updateOrganic(organicId) {
    const name = modalForm.querySelector(
        'input[placeholder="Nome do organico"]',
    ).value;
    const barcode = modalForm.querySelector(
        'input[placeholder="Codigo de barras"]',
    ).value;
    let expiration_value = modalForm.querySelector(
        'input[placeholder="Data de validade"]',
    ).value;
    const expiration_date = formatDate(expiration_value);
    const updatedOrganicData = { name, barcode, expiration_date };

    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/organic_compounds/${organicId}`;
        const response = await fetch(apiEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrganicData),
        });

        if (response.ok) {
            fetchData();
            closeModal();
        } else {
            console.error("Error updating organic:", response.status);
        }
    } catch (error) {
        console.error("Error updating organic:", error);
    }
}

async function deleteSupplier(organicId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/organic_compounds/${organicId}`;
        const response = await fetch(apiEndpoint, { method: "DELETE" });

        if (response.ok) {
            alert("Organico deletado com sucesso!");
            fetchData();
        } else {
            console.error("Error deleting organic:", response.status);
        }
    } catch (error) {
        console.error("Error deleting organic:", error);
    }
}

function closeModal() {
    modal.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);

fetchData();

function openNewOrganicModal() {
    modalForm.querySelector('input[placeholder="Nome do organico"]').value = "";
    modalForm.querySelector('input[placeholder="Codigo de barras"]').value = "";
    modalForm.querySelector('input[placeholder="Data de validade"]').value = "";

    // Set the modal header to "Novo Cliente"
    modal.querySelector(".modal-header h2").textContent = "Novo Organico";

    // Update the "Salvar" button's onclick event to call createNewSupplier
    modal.querySelector(".modal-footer .button.green").onclick =
        createNewOrganic;

    // Show the modal
    modal.classList.add("active");
}

async function createNewOrganic() {
    const name = modalForm.querySelector(
        'input[placeholder="Nome do organico"]',
    ).value;
    const barcode = modalForm.querySelector(
        'input[placeholder="Codigo de barras"]',
    ).value;
    let expiration_value = modalForm.querySelector(
        'input[placeholder="Data de validade"]',
    ).value;
    const expiration_date = formatDate(expiration_value);
    const newOrganicData = { name, barcode, expiration_date };

    try {
        const apiEndpoint =
            "https://api-cyber-market-js.onrender.com/api/organic_compounds";
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrganicData),
        });

        if (response.ok) {
            fetchData();
            closeModal();
        } else {
            const errorResponse = await response.json();
            let errorMessage = errorResponse.errors[0].msg;
            alert(errorMessage);
        }
    } catch (error) {
        console.error("Error creating oprganic:", error);
    }
}
