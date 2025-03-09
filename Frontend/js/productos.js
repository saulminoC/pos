// Función para filtrar productos según la búsqueda
function filterProducts() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll("#product-list tr");

    rows.forEach(row => {
        const nameCell = row.cells[1]; // Columna de nombre del producto
        const name = nameCell.textContent.toLowerCase();

        if (name.includes(searchValue)) {
            row.style.display = "";  // Mostrar fila si el nombre coincide
        } else {
            row.style.display = "none";  // Ocultar fila si no coincide
        }
    });
}

// Función para cerrar el modal de edición
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";  // Ocultar el modal de edición
}

// Función para cerrar el modal de añadir producto
function closeAddModal() {
    document.getElementById('addProductModal').style.display = 'none';  // Ocultar el modal de añadir producto
}

// Función para cargar productos según la sucursal seleccionada
function cargarProductos() {
    const sucursalId = document.getElementById("selectSucursal").value;

    // Validar si se ha seleccionado una sucursal
    if (!sucursalId) {
        alert("Por favor selecciona una sucursal");
        return; // Detener la ejecución si no hay sucursal seleccionada
    }

    // Realizar la solicitud al servidor
    fetch(`/pos/backend/productos/obtener_productos.php?sucursal_id=${sucursalId}`)
        .then(response => response.json()) // Parsear la respuesta como JSON
        .then(data => {
            // Verificar si la respuesta es un arreglo
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    alert("No hay productos disponibles para esta sucursal");
                }
                actualizarTablaProductos(data); // Actualizar la tabla con los productos
            } else {
                // Manejar el caso en que la respuesta no es un arreglo
                console.error("La respuesta no es un arreglo:", data);
                if (data.error) {
                    alert(data.error); // Mostrar el mensaje de error del servidor
                }
            }
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            alert("Hubo un problema al cargar los productos.");
        });
}

// Función para actualizar la tabla de productos
function actualizarTablaProductos(data) {
    const productosTabla = document.getElementById("product-list");
    productosTabla.innerHTML = ''; // Limpiar la tabla antes de agregar los productos

    data.forEach(producto => {
        const row = productosTabla.insertRow();
        row.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.stock}</td>
            <td>$${producto.precio_base}</td>
            <td>${producto.categoria}</td>
            <td>
    <button class="btn edit-btn" data-id="${producto.id_producto}" onclick="editProduct(${producto.id_producto})">Editar</button>
    <button class="btn delete-btn" data-id="${producto.id_producto}" onclick="deleteProduct(${producto.id_producto})">Eliminar</button>
</td>

        `;
    });
}

// Llamar a cargarProductos() cuando cambie la sucursal
document.getElementById("selectSucursal").addEventListener('change', cargarProductos);

// Llamar a cargarProductos() cuando se carga la página (si hay una sucursal seleccionada)
window.onload = function () {
    const sucursalId = document.getElementById("selectSucursal").value;
    if (sucursalId) {
        cargarProductos(); // Cargar productos solo si hay una sucursal seleccionada
    }
};

// Función para actualizar la tabla de productos
function actualizarTablaProductos(data) {
    const productosTabla = document.getElementById("product-list");
    productosTabla.innerHTML = ''; // Limpiar la tabla antes de agregar los productos

    data.forEach(producto => {
        const row = productosTabla.insertRow();
        row.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.stock}</td>
            <td>$${producto.precio_base}</td>
            <td>${producto.categoria}</td>
            <td><button class="btn edit-btn" data-id="${producto.id_producto}" onclick="editProduct(${producto.id_producto})">Editar</button></td>
            <td><button class="btn delete-btn" data-id="${producto.id_producto}" onclick="deleteProduct(${producto.id_producto})">Eliminar</button></td>
        `;
    });
}

// Función para abrir el modal de edición con los datos del producto
function editProduct(id) {
    // Obtener las categorías al abrir el modal
    obtenerCategorias();

    const sucursalId = document.getElementById("selectSucursal").value;

    if (!sucursalId) {
        alert("Por favor selecciona una sucursal");
        return;
    }

    fetch(`/pos/backend/productos/obtener_productos.php?id_producto=${id}&sucursal_id=${sucursalId}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const producto = data.find(p => p.id_producto == id);

                if (!producto) {
                    alert('Producto no encontrado');
                    return;
                }

                // Asignar los valores al formulario de edición
                document.getElementById("editNombre").value = producto.nombre;
                document.getElementById("editDescripcion").value = producto.descripcion;
                document.getElementById("editStock").value = producto.stock;
                document.getElementById("editPrecio").value = producto.precio_base;
                document.getElementById("editCategoria").value = producto.categoria;

                // Asignar el id_producto al formulario (lo necesitamos para enviarlo)
                document.getElementById("editForm").dataset.id = producto.id_producto;

                // Mostrar el modal de edición
                document.getElementById("editModal").style.display = "flex";
            } else {
                console.error("La respuesta no es un arreglo:", data);
                if (data.error) {
                    alert(data.error);
                }
            }
        })
        .catch(error => {
            console.error('Error al obtener el producto:', error);
        });
}


// Función para manejar el envío del formulario de edición
document.getElementById("editForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const id_producto = document.getElementById("editForm").dataset.id;
    const nombre = document.getElementById("editNombre").value;
    const descripcion = document.getElementById("editDescripcion").value;
    const stock = document.getElementById("editStock").value;
    const precio_base = document.getElementById("editPrecio").value;
    const categoria = document.getElementById("editCategoria").value;
    const sucursalId = document.getElementById("selectSucursal").value;

    console.log('Datos antes de la validación:', {
        id_producto,
        nombre,
        descripcion,
        stock,
        precio_base,
        categoria,
        sucursalId
    });

    // Verificar que todos los campos estén completos
    if (!id_producto || !nombre || !descripcion || !stock || !precio_base || !categoria || !sucursalId) {
        alert("Por favor completa todos los campos");
        return;
    }

    // Mostrar los datos en la consola para verificar
    console.log({
        id_producto,
        nombre,
        descripcion,
        stock,
        precio_base,
        categoria,
        sucursal_id: sucursalId
    });

    // Enviar los datos al servidor
    fetch('/pos/backend/productos/editar_producto.php', {
        method: 'POST',
        body: JSON.stringify({
            id_producto: id_producto,
            nombre: nombre,
            descripcion: descripcion,
            stock: stock,
            precio_base: precio_base,
            categoria: categoria,
            sucursal_id: sucursalId
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Producto actualizado con éxito");
                closeEditModal();
                cargarProductos();
            } else {
                alert("Hubo un error al actualizar el producto: " + (data.error || ''));
            }
        })
        .catch(error => {
            console.error("Error al actualizar el producto:", error);
            alert("Hubo un problema al actualizar el producto. Verifica la consola para más detalles.");
        });
});


// Función para abrir el modal de añadir producto
function openAddModal() {
    document.getElementById('addProductModal').style.display = 'flex';
    obtenerCategorias();
}

// Función para obtener las categorías de la base de datos
function obtenerCategorias() {
    fetch('/pos/backend/productos/productos_categorias.php')
        .then(response => response.json())
        .then(data => {
            // Actualizar el <select> de categorías en el modal de edición
            const categoriaSelectEdit = document.getElementById('editCategoria');
            generarOpcionesCategoria(categoriaSelectEdit, data);

            // Actualizar el <select> de categorías en el modal de añadir producto
            const categoriaSelectAdd = document.getElementById('categoria');
            generarOpcionesCategoria(categoriaSelectAdd, data);
        })
        .catch(error => {
            console.error('Error al obtener las categorías:', error);
        });
}

// Función auxiliar para generar opciones de categoría
function generarOpcionesCategoria(selectElement, categorias) {
    selectElement.innerHTML = ''; // Limpiar el <select> antes de agregar las opciones

    // Agregar una opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Seleccione categoría --';
    selectElement.appendChild(defaultOption);

    // Agregar las categorías como opciones
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
    });
}

// Función para eliminar un producto
function deleteProduct(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        fetch(`/pos/backend/productos/eliminar_producto.php?id_producto=${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Producto eliminado exitosamente.");
                    cargarProductos();
                } else {
                    alert("Hubo un error al eliminar el producto.");
                }
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    }
}

// Función para manejar el envío del formulario de añadir producto
document.getElementById('addProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const stock = document.getElementById('stock').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const sucursalId = document.getElementById('selectSucursal').value;

    if (!sucursalId) {
        alert('Por favor selecciona una sucursal');
        return;
    }

    fetch('/pos/backend/productos/agregar_producto.php', {
        method: 'POST',
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            stock: stock,
            precio: precio,
            categoria: categoria,
            sucursal_id: sucursalId
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto agregado exitosamente');
                closeAddModal();
                cargarProductos();
            } else {
                alert('Error al agregar el producto');
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
});

// Llamar a cargarProductos() cuando cambie la sucursal
document.getElementById("selectSucursal").addEventListener('change', cargarProductos);

// Llamar a cargarProductos() cuando se carga la página (si hay una sucursal seleccionada)
window.onload = function () {
    const sucursalId = document.getElementById("selectSucursal").value;
    if (sucursalId) {
        cargarProductos(); // Cargar productos solo si hay una sucursal seleccionada
    }
};