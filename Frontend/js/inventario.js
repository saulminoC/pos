// Función para cargar productos según la sucursal seleccionada
function cargarProductos() {
    const sucursalId = document.getElementById("selectSucursal").value;

    if (sucursalId === "") {
        alert("Por favor selecciona una sucursal");
        return;
    }

    // Crear una solicitud AJAX
    fetch('/pos/backend/inventario/inventario.php?sucursal_id=' + sucursalId)
        .then(response => response.json())
        .then(data => {
            const productosTabla = document.getElementById("productosTabla").getElementsByTagName("tbody")[0];
            productosTabla.innerHTML = ''; // Limpiar tabla antes de llenarla

            if (data.length === 0) {
                productosTabla.innerHTML = "<tr><td colspan='7' class='text-center'>No hay productos disponibles</td></tr>";
                return;
            }

            // Llenar la tabla con los productos
            data.forEach(producto => {
                const row = productosTabla.insertRow();
                row.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.precio_base}</td>
                    <td>${producto.sucursal}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editarProducto(${producto.id_producto})">Editar</button>
                        <button class="btn btn-danger" onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Función para cargar productos según la sucursal seleccionada
function cargarProductos() {
    const sucursalId = document.getElementById("selectSucursal").value;

    if (sucursalId === "") {
        alert("Por favor selecciona una sucursal");
        return;
    }

    // Crear una solicitud AJAX para cargar los productos
    fetch('/pos/backend/inventario/inventario.php?sucursal_id=' + sucursalId)
        .then(response => response.json())
        .then(data => {
            const productosTabla = document.getElementById("productosTabla").getElementsByTagName("tbody")[0];
            productosTabla.innerHTML = ''; // Limpiar tabla antes de llenarla

            if (data.length === 0) {
                productosTabla.innerHTML = "<tr><td colspan='6' class='text-center'>No hay productos disponibles</td></tr>";
                return;
            }

            // Llenar la tabla con los productos
            data.forEach(producto => {
                const row = productosTabla.insertRow();
                row.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.precio_base}</td>
                    <td>${producto.sucursal}</td>
                `;
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Función para generar y descargar el reporte en Excel
function descargarExcel() {
    const sucursalId = document.getElementById("selectSucursal").value;

    if (sucursalId === "") {
        alert("Por favor selecciona una sucursal");
        return;
    }

    window.location.href = '/pos/backend/inventario/descargarExcel.php?sucursal_id=' + sucursalId;
}

// Función para generar y descargar el reporte en PDF
function descargarPDF() {
    const sucursalId = document.getElementById("selectSucursal").value;

    if (sucursalId === "") {
        alert("Por favor selecciona una sucursal");
        return;
    }

    window.location.href = '/pos/backend/inventario/descargarPDF.php?sucursal_id=' + sucursalId;
}



