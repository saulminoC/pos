document.addEventListener("DOMContentLoaded", function () {
    const sucursalId = new URLSearchParams(window.location.search).get("sucursal");

    if (!sucursalId) {
        console.error("Sucursal no encontrada");
        return;
    }

    // 📌 Simulación de datos en lugar de PHP
    const sucursalInfo = {
        "1": {
            nombre: "Sucursal 1",
            ventasTotales: "$5000.00",
            ventasEfectivo: "$2000.00",
            ventasTarjeta: "$3000.00",
            vendedores: ["Juan", "Carlos"],
            detallesVentas: [
                { hora: "10:00", vendedor: "Juan", formaPago: "Efectivo", total: "$1000.00" },
                { hora: "11:30", vendedor: "Carlos", formaPago: "Tarjeta", total: "$2000.00" }
            ]
        },
        "2": {
            nombre: "Sucursal 2",
            ventasTotales: "$3000.00",
            ventasEfectivo: "$1500.00",
            ventasTarjeta: "$1500.00",
            vendedores: ["Ana", "Luis"],
            detallesVentas: [
                { hora: "09:45", vendedor: "Ana", formaPago: "Efectivo", total: "$1500.00" },
                { hora: "13:15", vendedor: "Luis", formaPago: "Tarjeta", total: "$1500.00" }
            ]
        },
        "3": {
            nombre: "Sucursal 3",
            ventasTotales: "$10.00",
            ventasEfectivo: "$1500.00",
            ventasTarjeta: "$1500.00",
            vendedores: ["Ana", "Luis"],
            detallesVentas: [
                { hora: "09:45", vendedor: "Ana", formaPago: "Efectivo", total: "$1500.00" },
                { hora: "13:15", vendedor: "Luis", formaPago: "Tarjeta", total: "$1500.00" }
            ]
        }
    };

    function loadSucursalData() {
        const sucursal = sucursalInfo[sucursalId];

        if (!sucursal) {
            console.error("Sucursal no encontrada");
            return;
        }

        // 📌 Mostrar la sucursal en la página
        document.querySelector(".text-center.text-xl").textContent = sucursal.nombre;

        document.getElementById("sucursalData").innerHTML = `
            <div class="ventas-section" style="display: flex; gap: 15px; justify-content: center;">
                <div class="venta-card">
                    <h3>Ventas Totales</h3>
                    <p>${sucursal.ventasTotales}</p>
                </div>
                <div class="venta-card">
                    <h3>Ventas con Efectivo</h3>
                    <p>${sucursal.ventasEfectivo}</p>
                </div>
                <div class="venta-card">
                    <h3>Ventas con Tarjeta</h3>
                    <p>${sucursal.ventasTarjeta}</p>
                </div>
            </div>
            <h3 style="margin-top: 20px;">Detalles de Ventas</h3>
            <div class="table-container"> <!-- Contenedor con barra de desplazamiento -->
            <table>
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Vendedor</th>
                        <th>Forma de Pago</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${sucursal.detallesVentas.map(venta => `
                        <tr>
                            <td>${venta.hora}</td>
                            <td>${venta.vendedor}</td>
                            <td>${venta.formaPago}</td>
                            <td>${venta.total}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('vendorSucursal').value = sucursal.nombre;
    }

    window.openAddVendorModal = function () {
        document.getElementById('addVendorModal').style.display = 'flex';
    };

    window.openEditVendorModal = function (btn, index) {
        const row = btn.closest('tr');
        const cells = row.querySelectorAll('td');
        const nombre = cells[0].textContent;
        const email = cells[1].textContent;
        const sucursal = cells[2].textContent;
    
        document.getElementById('editVendorName').value = nombre;
        document.getElementById('editVendorEmail').value = email;
        document.getElementById('editVendorSucursal').value = sucursal;
        document.getElementById('editVendorPassword').value = ''; // Limpiar el campo de contraseña
    
        document.getElementById('editVendorModal').style.display = 'flex';
    
        // Guardar la fila a editar
        document.getElementById('editVendorForm').dataset.rowIndex = index;
    };

    window.openDeleteVendorModal = function (btn, index) {
        vendorToDelete = index;
        document.getElementById('deleteVendorModal').style.display = 'flex';
    };

    window.closeDeleteModal = function () {
        document.getElementById('deleteVendorModal').style.display = 'none';
    };
    

    function loadVendors() {
        const vendorsData = [
            { nombre: "Juan", email: "juan@example.com", sucursal: "Sucursal 1" },
            { nombre: "Carlos", email: "carlos@example.com", sucursal: "Sucursal 2" },
            { nombre: "Ana", email: "ana@example.com", sucursal: "Sucursal 1" }
        ];

        const vendorsTable = document.getElementById('vendorsTable').getElementsByTagName('tbody')[0];
        vendorsTable.innerHTML = ""; // Limpiar tabla antes de cargar

        vendorsData.forEach((vendor, index) => {
            const row = vendorsTable.insertRow();
            row.insertCell(0).textContent = vendor.nombre;
            row.insertCell(1).textContent = vendor.email;
            row.insertCell(2).textContent = vendor.sucursal;

            const actionsCell = row.insertCell(3);
            actionsCell.innerHTML = `
                <button class="btn" onclick="openEditVendorModal(this, ${index})">Editar</button>
                <button class="btn" onclick="openDeleteVendorModal(this, ${index})">Eliminar</button>
            `;
        });
    }

    function openAddVendorModal() {
        document.getElementById('addVendorModal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('addVendorModal').style.display = 'none';
    }

    function openEditVendorModal(btn, index) {
        const row = btn.closest('tr');
        const cells = row.querySelectorAll('td');

        document.getElementById('editVendorName').value = cells[0].textContent;
        document.getElementById('editVendorEmail').value = cells[1].textContent;
        document.getElementById('editVendorSucursal').value = cells[2].textContent;
        document.getElementById('editVendorPassword').value = '';

        document.getElementById('editVendorModal').style.display = 'flex';
    }

    function closeEditModal() {
        document.getElementById('editVendorModal').style.display = 'none';
    }

    function openDeleteVendorModal(btn, index) {
        document.getElementById('deleteVendorModal').style.display = 'flex';
    }

    function closeDeleteModal() {
        document.getElementById('deleteVendorModal').style.display = 'none';
    }

    document.getElementById("addVendorForm").addEventListener("submit", function (event) {
        event.preventDefault(); 

        const nombre = document.getElementById("vendorName").value;
        const email = document.getElementById("vendorEmail").value;

        alert(`Vendedor agregado: ${nombre}, Email: ${email}`);

        closeModal();
        loadVendors();
    });

    document.getElementById("editVendorForm").addEventListener("submit", function (event) {
        event.preventDefault(); 

        alert("Vendedor editado correctamente");
        closeEditModal();
        loadVendors();
    });

    document.getElementById("confirmDelete").addEventListener("click", function () {
        alert("Vendedor eliminado");
        closeDeleteModal();
        loadVendors();
    });

    loadSucursalData();
    loadVendors();
});
