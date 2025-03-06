const products = {
    helados: [{name: "Helado de Chocolate", price: 30}, {name: "Helado de Vainilla", price: 28}, {name: "Helado de Fresa", price: 25}],
    paletas: [{name: "Paleta de Mango", price: 15}, {name: "Paleta de Coco", price: 18}, {name: "Paleta de Tamarindo", price: 20}],
    refrescos: [{name: "Coca-Cola", price: 18}, {name: "Sprite", price: 16}, {name: "Fanta", price: 17}],
    snacks: [{name: "Papas", price: 12}, {name: "Chocolates", price: 25}, {name: "Galletas", price: 15}]
};
let selectedItems = [];
let totalAmount = 0;

function openModal(modalId, category = null) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("hidden");
        if (category) {
            loadCategoryProducts(category);
        }
    } else {
        console.error(`Modal con ID ${modalId} no encontrado.`);
    }

    // Resetear el modal de búsqueda
    if (modalId === "searchModal") {
        document.getElementById('searchInput').value = '';
        filterProducts('');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
    } else {
        console.error(`Modal con ID ${modalId} no encontrado.`);
    }
}

function loadCategoryProducts(category) {
    const display = document.getElementById("categoryProducts");
    display.innerHTML = "";
    products[category].forEach(product => {
        const button = document.createElement("button");
        button.classList = "bg-gray-300 p-2 rounded-lg shadow w-full";
        button.textContent = `${product.name} - $${product.price}`;
        button.onclick = () => selectProduct(product);
        display.appendChild(button);
    });
}

function selectProduct(product) {
    const quantity = prompt(`Ingrese la cantidad de ${product.name}:`, 1);
    if (quantity && !isNaN(quantity) && quantity > 0) {
        const existingProduct = selectedItems.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity);
            existingProduct.total = existingProduct.price * existingProduct.quantity;
        } else {
            selectedItems.push({
                name: product.name,
                quantity: parseInt(quantity),
                price: product.price,
                total: product.price * quantity
            });
        }

        updateTable();
        updateTotal();
    }
}

function updateTable() {
    const tableBody = document.getElementById("selectedProductsTable");
    tableBody.innerHTML = "";  // Limpiar la tabla antes de agregar los productos
    selectedItems.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-3 border">${item.name}</td>
            <td class="p-3 border">${item.quantity}</td>
            <td class="p-3 border">$${item.price}</td>
            <td class="p-3 border">$${item.total}</td>
            <td class="p-3 border">
                <button class="bg-yellow-300 p-2 rounded-lg shadow" onclick="editQuantity(${index})">Editar</button>
                <button class="bg-red-500 text-white p-2 rounded-lg shadow" onclick="confirmRemoveProduct(${index})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Habilitar o deshabilitar botones de pago
    document.getElementById("payCardBtn").disabled = selectedItems.length === 0;
    document.getElementById("payCashBtn").disabled = selectedItems.length === 0;
}

function updateTotal() {
    totalAmount = selectedItems.reduce((total, item) => total + item.total, 0);
    document.getElementById("totalPrice").textContent = `$${totalAmount.toFixed(2)}`;
}

function editQuantity(index) {
    const newQuantity = prompt(`Ingrese la nueva cantidad para ${selectedItems[index].name}:`, selectedItems[index].quantity);
    if (newQuantity && !isNaN(newQuantity) && newQuantity > 0) {
        selectedItems[index].quantity = parseInt(newQuantity);
        selectedItems[index].total = selectedItems[index].price * selectedItems[index].quantity;
        updateTable();
        updateTotal();
    }
}

function confirmRemoveProduct(index) {
    const isConfirmed = confirm("¿Está seguro de que desea eliminar este producto?");
    if (isConfirmed) {
        removeProduct(index);
    }
}

function removeProduct(index) {
    selectedItems.splice(index, 1);
    updateTable();
    updateTotal();
}

function printTicket() {
    const ticketProducts = document.getElementById("ticketProducts");
    const ticketTotal = document.getElementById("ticketTotal");
    const ticketDate = document.getElementById("ticketDate");

    // Llenar los datos del ticket
    ticketDate.textContent = new Date().toLocaleString();
    ticketProducts.innerHTML = "";
    selectedItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-1">${item.name}</td>
            <td class="p-1">${item.quantity}</td>
            <td class="p-1">$${item.total}</td>
        `;
        ticketProducts.appendChild(row);
    });
    ticketTotal.textContent = `$${totalAmount.toFixed(2)}`;

    // Mostrar el ticket y luego imprimir
    document.getElementById("ticket").style.display = 'block'; // Muestra el ticket
    window.print(); // Inicia la impresión
    document.getElementById("ticket").style.display = 'none'; // Oculta el ticket después de imprimir
}

function openPaymentModal() {
    document.getElementById("amountToPay").value = `$${totalAmount.toFixed(2)}`;
    document.getElementById("amountPaid").value = '';
    document.getElementById("change").value = '$0.00';
    openModal('paymentModal');
}

function calculateChange() {
    const amountPaid = parseFloat(document.getElementById("amountPaid").value) || 0;
    const change = amountPaid - totalAmount;

    // Actualizar el cambio en el campo de texto
    document.getElementById("change").value = `$${Math.max(0, change).toFixed(2)}`;

    // Si el monto pagado es mayor que 0, habilitar el botón "Aceptar"
    const acceptBtn = document.getElementById("acceptBtn");
    acceptBtn.disabled = amountPaid <= 0;
}

function processPayment() {
    // Llenar los datos del ticket
    const ticketProducts = document.getElementById("ticketProducts");
    const ticketTotal = document.getElementById("ticketTotal");
    const ticketDate = document.getElementById("ticketDate");

    ticketDate.textContent = new Date().toLocaleString();
    ticketProducts.innerHTML = "";
    selectedItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-1">${item.name}</td>
            <td class="p-1">${item.quantity}</td>
            <td class="p-1">$${item.total}</td>
        `;
        ticketProducts.appendChild(row);
    });
    ticketTotal.textContent = `$${totalAmount.toFixed(2)}`;

    // Mostrar el ticket y luego imprimir
    document.getElementById("ticket").style.display = 'block'; // Muestra el ticket
    window.print(); // Inicia la impresión
    document.getElementById("ticket").style.display = 'none'; // Oculta el ticket después de imprimir

    // Limpiar la pantalla para la siguiente venta
    resetSale();
    closeModal('paymentModal');
}

function resetSale() {
    // Limpiar la tabla de productos seleccionados
    selectedItems = [];
    updateTable();
    updateTotal();

    // Limpiar el modal de pago
    document.getElementById("amountPaid").value = '';
    document.getElementById("change").value = '$0.00';

    // Resetear el total a cero en el panel
    document.getElementById("totalPrice").textContent = "$0.00";
}