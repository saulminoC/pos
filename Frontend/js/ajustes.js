// Función para cargar los productos en el formulario de ajustes
function cargarProductos() {
    fetch('/pos/backend/inventario/productos.php')
        .then(response => response.json())
        .then(data => {
            const productoSelect = document.getElementById("productoId");
            productoSelect.innerHTML = ''; // Limpiar el select antes de llenarlo

            data.forEach(producto => {
                const option = document.createElement("option");
                option.value = producto.id_producto;
                option.textContent = producto.nombre;
                productoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Función para registrar un ajuste manual
document.getElementById('ajusteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const productoId = document.getElementById("productoId").value;
    const tipoAjuste = document.getElementById("tipoAjuste").value;
    const cantidad = document.getElementById("cantidad").value;
    const motivo = document.getElementById("motivo").value;

    // Enviar los datos al backend para registrar el ajuste
    fetch('/pos/backend/inventario/ajustarInventario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            producto_id: productoId,
            tipo: tipoAjuste,
            cantidad: cantidad,
            motivo: motivo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Ajuste realizado correctamente');
        } else {
            alert('Error al realizar el ajuste');
        }
    })
    .catch(error => console.error("Error al registrar ajuste:", error));
});

// Cargar los productos al cargar la página
window.onload = cargarProductos;
