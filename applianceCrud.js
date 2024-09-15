const apiData = document.querySelector(".dados"); // Selects the <tbody> element
const modal = document.getElementById("modal"); // Get the modal element
const modalClose = document.getElementById("modalClose"); // Get the close button
const modalForm = document.querySelector(".modal-form"); // Get the modal form
const apiEndpoint = "https://api-cyber-market-js.onrender.com/api/appliances";


async function fetchData() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json(); // Assuming API returns JSON data

        // Access the array within the `data` property
        const appliances = data.data; // Now `appliances` is an array

        // Clear existing data in the table
        apiData.innerHTML = ""; // Clears the existing rows in the table

        // Iterate through the appliances array
        appliances.forEach((appliance) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${appliance.brand}</td>
                <td>${appliance.category}</td>
                <td>
                    <button type="button" class="button green" data-id="${appliance.id}" onclick="editFunction(${appliance.id})">editar</button>
                    <button type="button" class="button red" data-id="${appliance.id}" onclick="deleteSupplier(${appliance.id})">excluir</button>
                </td>
            `;
            apiData.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to display an error message to the user here
    }
}

async function editFunction(applianceId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/appliances/${applianceId}`;
        const response = await fetch(apiEndpoint);
        const applianceData = await response.json();

        if (modalForm.querySelector('input[placeholder="Marca do eletrodomestico"]')) {
            modalForm.querySelector(
                'input[placeholder="Marca do eletrodomestico"]',
            ).value = applianceData.data.brand;
        }
        if (modalForm.querySelector('select[ name="category"]')) {
            modalForm.querySelector('select[ name="category"]').value =
                applianceData.data.category;
        }

        modal.querySelector(".modal-header h2").textContent = "Editar Eletrodomestico";

        modal.querySelector(".modal-footer .button.green").onclick = () =>
            updateAppliance(applianceId);

        modal.classList.add("active");
    } catch (error) {
        console.error("Error fetching organic data:", error);
    }
}

async function updateAppliance(applianceId) {
    const brand = modalForm.querySelector(
        'input[placeholder="Marca do eletrodomestico"]',
    ).value;
    const category = modalForm.querySelector('select[ name="category"]').value;
    
    const updatedApplianceData = { brand, category };

    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/appliances/${applianceId}`;
        const response = await fetch(apiEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedApplianceData),
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

async function deleteSupplier(applianceId) {
    try {
        const apiEndpoint = `https://api-cyber-market-js.onrender.com/api/appliances/${applianceId}`;
        const response = await fetch(apiEndpoint, { method: "DELETE" });

        if (response.ok) {
            alert("Eletrodomestico deletado com sucesso!");
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

function openNewApplianceModal() {
    modalForm.querySelector('input[placeholder="Marca do eletrodomestico"]').value = "";
    modalForm.querySelector('select[ name="category"]').value = "";

    modal.querySelector(".modal-header h2").textContent = "Novo Inorganico";

    modal.querySelector(".modal-footer .button.green").onclick =
        createNewAppliance;

    // Show the modal
    modal.classList.add("active");
}

async function createNewAppliance() {
    const brand = modalForm.querySelector(
        'input[placeholder="Marca do eletrodomestico"]',
    ).value;
    const category = modalForm.querySelector('select[ name="category"]').value
    const newApplianceData = { brand, category };


    try {
        const apiEndpoint =
            "https://api-cyber-market-js.onrender.com/api/appliances";
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newApplianceData),
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
