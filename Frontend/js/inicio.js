/*const products = {
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



*/

// Función para cargar las categorías
function loadCategories() {
    const display = document.getElementById("categoriesContainer");

    $.ajax({
        url: '/pos/backend/obtener_categorias.php',
        method: 'GET',
        dataType: 'json',
        success: function(categories) {
            console.log(categories);  // Para depurar las categorías obtenidas

            display.innerHTML = "";

            const colors = ["bg-yellow-400", "bg-yellow-500", "bg-green-400", "bg-blue-400", "bg-blue-500"];

            categories.forEach((category, index) => {
                const colorClass = colors[index % colors.length];
                const button = document.createElement("button");
                button.classList = `${colorClass} p-3 rounded-lg shadow`;
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                button.onclick = () => openModal('categoryModal', category);
                display.appendChild(button);
            });
        },
        error: function() {
            alert('Hubo un error al obtener las categorías.');
        }
    });
}


// Llamar a la función para cargar las categorías al cargar la página
document.addEventListener('DOMContentLoaded', loadCategories);







let selectedItems = [];
let totalAmount = 0;

// Abrir modal con la categoría seleccionada
function openModal(modalId, category = null) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("hidden");
        if (category) {
            loadCategoryProducts(category);  // Cargar productos de la categoría seleccionada
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

// Cerrar el modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
    } else {
        console.error(`Modal con ID ${modalId} no encontrado.`);
    }
}

// Cargar productos según la categoría seleccionada
function loadCategoryProducts(category) {
    const display = document.getElementById("categoryProducts");
    display.innerHTML = "";  // Limpiar productos anteriores
    console.log(category);

    // Hacer solicitud AJAX para obtener productos de la categoría seleccionada
    $.ajax({
        url: '/pos/backend/obtener_productos.php', // URL del script PHP que obtiene los productos
        method: 'GET',
        data: { categoria: category }, // Enviar la categoría seleccionada
        dataType: 'json',
        success: function(products) {
            console.log('Respuesta del servidor:', products); // Imprime la respuesta en consola
            if (products.length === 0) {
                display.innerHTML = "<p>No hay productos disponibles en esta categoría.</p>";
            } else {
                products.forEach(product => {
                    const button = document.createElement("button");
                    button.classList = "bg-gray-300 p-2 rounded-lg shadow w-full";
                    button.textContent = `${product.name} - $${product.price}`;
                    button.onclick = () => selectProduct(product);
                    display.appendChild(button);
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud AJAX:');
            console.error('Estado:', status); // Estado de la solicitud
            console.error('Error:', error); // Mensaje de error
            console.error('Respuesta del servidor:', xhr.responseText); // Respuesta completa del servidor
            alert('Hubo un error al obtener los productos.');
        }
    });
    
}

// Seleccionar un producto y agregarlo a la lista
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

// Actualizar la tabla de productos seleccionados
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

// Actualizar el total de la venta
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
    const amountPaid = parseFloat(document.getElementById("amountPaid").value) || 0;
    const change = amountPaid - totalAmount;

    if (change < 0) {
        alert("El monto pagado no es suficiente.");
        return;
    }

    document.getElementById("change").value = `$${change.toFixed(2)}`;

    // Datos que se enviarán al servidor
    const dataToSend = {
        productos: selectedItems,
        total: totalAmount,
        pagado: amountPaid,
        cambio: change
    };

    // Mostrar los datos en la consola antes de enviarlos
    console.log("Datos enviados al servidor:", dataToSend);

    $.ajax({
        url: '/pos/backend/registrar_venta.php',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(dataToSend),
        success: function(response) {
            console.log("Respuesta del servidor:", response);
            if (response.success) {
                alert("Venta registrada exitosamente.");
                fillTicket(dataToSend); // Llenar el ticket con los datos
                showModal(); // Mostrar el modal con el ticket
            } else {
                alert("Error: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error en AJAX:", xhr.responseText);
            alert('Hubo un error al procesar el pago.');
        }
    });
}

// Función para llenar el ticket con los datos de la venta
function fillTicket(data) {
    console.log(data);
    document.getElementById("ticketDate").innerText = new Date().toLocaleString();
    document.getElementById("ticketTotal").innerText = data.total.toFixed(2);

    const ticketProducts = document.getElementById("ticketProducts");
    ticketProducts.innerHTML = ""; // Limpiar tabla antes de agregar nuevos datos

    data.productos.forEach(producto => {
        let row = `<tr>
                      <td class="p-1">${producto.name}</td>
                      <td class="p-1">${producto.quantity}</td>
                      <td class="p-1">$${producto.total.toFixed(2)}</td>
                   </tr>`;
        ticketProducts.innerHTML += row;
    });

    // Mostrar el ticket
    showModal();
}


// Función para mostrar el modal del ticket
function showModal() {
    // Ocultar el resto del contenido
    const allElements = document.body.children;
    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].id !== "ticket") {
            allElements[i].style.display = "none"; // Ocultar otros elementos
        }
    }

    // Mostrar el ticket
    document.getElementById("ticket").style.display = "block";

    // Imprimir automáticamente el ticket
    setTimeout(function() {
        window.print();
    }, 500); // Usamos un pequeño retraso para asegurarnos de que el ticket esté visible antes de imprimir
}

// Evento que se ejecuta después de la impresión o cancelación
window.onafterprint = function() {
    // Redirigir a la página de inicio
    window.location.href = "/pos/frontend/web/inicio.html"; // Cambia 'index.html' a la URL de tu pantalla de inicio
};


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