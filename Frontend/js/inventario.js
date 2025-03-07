// inventario.js

// Simulación de datos de productos e inventarios
const inventoryData = [
    { id: 1, name: "Paleta de Fresa", stock: 44, price: 15.00 },
    { id: 2, name: "Paleta de Limón", stock: 57, price: 14.00 },
    { id: 3, name: "Paleta de Chocolate", stock: 38, price: 18.00 },
    { id: 4, name: "Refresco de Cola", stock: 60, price: 12.00 },
    { id: 5, name: "Refresco de Naranja", stock: 25, price: 12.00 },
];

const movementsData = [
    { id: 1, productId: 1, type: "Entrada", quantity: 30, date: "2025-03-07" },
    { id: 2, productId: 2, type: "Salida", quantity: 5, date: "2025-03-06" },
    { id: 3, productId: 3, type: "Entrada", quantity: 20, date: "2025-03-05" },
];

const productSelect = document.getElementById('productSelect');
const stockTable = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
const movementTable = document.getElementById('movementTable').getElementsByTagName('tbody')[0];
const adjustmentForm = document.getElementById('adjustmentForm');

// Cargar los productos en el inventario
function loadInventoryData() {
    // Limpiar tablas
    stockTable.innerHTML = '';
    movementsData.forEach(movement => {
        const row = movementTable.insertRow();
        row.insertCell(0).textContent = movement.productId;
        row.insertCell(1).textContent = movement.type;
        row.insertCell(2).textContent = movement.quantity;
        row.insertCell(3).textContent = movement.date;
    });

    // Llenar los productos en la tabla de stock
    inventoryData.forEach(product => {
        const row = stockTable.insertRow();
        row.insertCell(0).textContent = product.id;
        row.insertCell(1).textContent = product.name;
        row.insertCell(2).textContent = product.stock;
        row.insertCell(3).textContent = `$${product.price.toFixed(2)}`;
        const actionsCell = row.insertCell(4);
        actionsCell.innerHTML = `<button class="btn" onclick="editProduct(${product.id})">Editar</button> <button class="btn" onclick="deleteProduct(${product.id})">Eliminar</button>`;
    });

    // Llenar el select de productos
    inventoryData.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });
}

// Función para agregar un ajuste manual
adjustmentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const productId = productSelect.value;
    const adjustmentAmount = document.getElementById('adjustmentAmount').value;
    const adjustmentReason = document.getElementById('adjustmentReason').value;

    if (adjustmentAmount && adjustmentReason) {
        const product = inventoryData.find(p => p.id == productId);
        if (product) {
            // Actualizar el stock del producto
            product.stock += parseInt(adjustmentAmount);
            alert('Ajuste realizado correctamente.');
            loadInventoryData();
        }
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Llamar la función para cargar los datos al inicio
loadInventoryData();
