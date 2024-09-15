const apiData = document.querySelector(".dados"); // Selects the <tbody> element
const modal = document.getElementById("modal"); // Get the modal element
const modalClose = document.getElementById("modalClose"); // Get the close button
const modalForm = document.querySelector(".modal-form"); // Get the modal form
const apiEndpoint =
    "https://api-cyber-market-js.onrender.com/api/non_organic_compounds";

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
        const non_organics = data.data; // Now `non_organics` is an array

        // Clear existing data in the table
        apiData.innerHTML = ""; // Clears the existing rows in the table

        // Iterate through the non_organics array
        non_organics.forEach((non_organic) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${non_organic.name}</td>
                <td>${non_organic.barcode}</td>
                <td>${non_organic.expiration_date}</td>
                <td>
                    <button type="button" class="button green" data-id="${non_organic.id}" onclick="editFunction(${non_organic.id})">editar</button>
                    <button type="button" class="button red" data-id="${non_organic.id}" onclick="deleteSupplier(${non_organic.id})">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to display an error message to the user here
    }
}

async function editFunction(non_organicId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/non_organic_compounds/${non_organicId}`;
        const response = await fetch(apiEndpoint);
        const organicData = await response.json();

        if (modalForm.querySelector('input[placeholder="Nome do inorganico"]')) {
            modalForm.querySelector(
                'input[placeholder="Nome do inorganico"]',
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

        modal.querySelector(".modal-header h2").textContent = "Editar Inorganico";

        modal.querySelector(".modal-footer .button.green").onclick = () =>
            updateNonOrganic(non_organicId);

        modal.classList.add("active");
    } catch (error) {
        console.error("Error fetching organic data:", error);
    }
}

async function updateNonOrganic(non_organicId) {
    const name = modalForm.querySelector(
        'input[placeholder="Nome do inorganico"]',
    ).value;
    const barcode = modalForm.querySelector(
        'input[placeholder="Codigo de barras"]',
    ).value;
    let expiration_value = modalForm.querySelector(
        'input[placeholder="Data de validade"]',
    ).value;
    const expiration_date = formatDate(expiration_value);
    const updatedNonOrganicData = { name, barcode, expiration_date };

    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/non_organic_compounds/${non_organicId}`;
        const response = await fetch(apiEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedNonOrganicData),
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

async function deleteSupplier(non_organicId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/non_organic_compounds/${non_organicId}`;
        const response = await fetch(apiEndpoint, { method: "DELETE" });

        if (response.ok) {
            alert("Inorganico deletado com sucesso!");
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

function openNewNonOrganicModal() {
    modalForm.querySelector('input[placeholder="Nome do inorganico"]').value = "";
    modalForm.querySelector('input[placeholder="Codigo de barras"]').value = "";
    modalForm.querySelector('input[placeholder="Data de validade"]').value = "";

    modal.querySelector(".modal-header h2").textContent = "Novo Inorganico";

    modal.querySelector(".modal-footer .button.green").onclick =
        createNewNonOrganic;

    // Show the modal
    modal.classList.add("active");
}

async function createNewNonOrganic() {
    const name = modalForm.querySelector(
        'input[placeholder="Nome do inorganico"]',
    ).value;
    const barcode = modalForm.querySelector(
        'input[placeholder="Codigo de barras"]',
    ).value;
    let expiration_value = modalForm.querySelector(
        'input[placeholder="Data de validade"]',
    ).value;
    const expiration_date = formatDate(expiration_value);
    const newNonOrganicData = { name, barcode, expiration_date };
    

    try {
        const apiEndpoint =
            "https://api-cyber-market-js.onrender.com/api/non_organic_compounds";
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNonOrganicData),
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
