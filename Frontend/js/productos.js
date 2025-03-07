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

// Función para obtener los productos de la base de datos
function obtenerProductos() {
    fetch('/pos/backend/productos/obtener_productos.php')
        .then(response => response.json())
        .then(data => {
            let productList = document.getElementById("product-list");
            productList.innerHTML = ''; // Limpiar la tabla antes de agregar los productos

            // Recorrer los productos y agregarlos a la tabla
            data.forEach(producto => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.stock}</td>
                    <td>$${producto.precio_base}</td>
                    <td>${producto.categoria}</td>
                    <td><button class="btn" onclick="editProduct(${producto.id_producto})">Editar</button></td>
                    <button class="btn bg-red-500 text-white py-2 px-4 rounded-lg text-sm md:text-base">Eliminar</button>

                `;
                productList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}

// Función para abrir el modal de edición con los datos del producto
function editProduct(id) {
    // Llamar a un endpoint para obtener los datos del producto por su id
    fetch(`/pos/backend/productos/obtener_productos.php?id_producto=${id}`)
        .then(response => response.json())
        .then(data => {
            // Asegúrate de que estás obteniendo el producto correcto con el id
            const producto = data.find(p => p.id_producto == id);  // Encontrar el producto correcto

            // Verifica los datos en la consola para asegurarte de que todo se está recibiendo correctamente
            console.log(producto); // Esto te ayudará a verificar si los datos se están recuperando correctamente

            // Asignar los valores al formulario
            document.getElementById("editNombre").value = producto.nombre;
            document.getElementById("editDescripcion").value = producto.descripcion;
            document.getElementById("editStock").value = producto.stock;
            document.getElementById("editPrecio").value = producto.precio_base;
            document.getElementById("editCategoria").value = producto.categoria;

            // Llamar a la función para obtener las categorías
            obtenerCategorias();

            // Establecer el ID del producto a editar
            document.getElementById("editForm").dataset.id = id;

            // Mostrar el modal de edición
            document.getElementById("editModal").style.display = "flex";
        })
        .catch(error => {
            console.error('Error al obtener el producto:', error);
        });
}


// Función para manejar el envío del formulario de edición
document.getElementById("editForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const id_producto = document.getElementById("editForm").dataset.id; // Usamos el ID del producto almacenado en el botón
    const nombre = document.getElementById("editNombre").value;
    const descripcion = document.getElementById("editDescripcion").value;
    const stock = document.getElementById("editStock").value;
    const precio_base = document.getElementById("editPrecio").value;
    const categoria = document.getElementById("editCategoria").value;

    // Enviar los datos para actualizar el producto
    fetch('/pos/backend/productos/editar_producto.php', {
        method: 'POST',
        body: JSON.stringify({
            id_producto: id_producto,
            nombre: nombre,
            descripcion: descripcion,
            stock: stock,
            precio_base: precio_base,
            categoria: categoria
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Producto actualizado con éxito");
            closeEditModal(); // Cerrar el modal
            obtenerProductos(); // Recargar la lista de productos
        } else {
            alert("Hubo un error al actualizar el producto");
        }
    })
    .catch(error => {
        console.error("Error al actualizar el producto:", error);
    });
});

// Función para abrir el modal de añadir producto
function openModal() {
    document.getElementById('addProductModal').style.display = 'flex';
    obtenerCategorias(); // Obtener las categorías cuando se abre el modal
}

// Función para obtener las categorías de la base de datos
// Función para obtener las categorías de la base de datos
// Función para obtener las categorías de la base de datos
function obtenerCategorias() {
fetch('/pos/backend/productos/productos_categorias.php')
.then(response => response.json())
.then(data => {
    // Obtener el select de categoría en el modal de editar
    let categoriaSelectEdit = document.getElementById('editCategoria');
    categoriaSelectEdit.innerHTML = ''; // Limpiar las opciones anteriores

    // Obtener el select de categoría en el modal de añadir producto
    let categoriaSelectAdd = document.getElementById('categoria');
    categoriaSelectAdd.innerHTML = ''; // Limpiar las opciones anteriores

    // Añadir la opción por defecto en el modal de edición
    let defaultOptionEdit = document.createElement('option');
    defaultOptionEdit.value = '';
    defaultOptionEdit.textContent = '-- Seleccione categoría --';
    categoriaSelectEdit.appendChild(defaultOptionEdit);

    // Añadir la opción por defecto en el modal de añadir producto
    let defaultOptionAdd = document.createElement('option');
    defaultOptionAdd.value = '';
    defaultOptionAdd.textContent = '-- Seleccione categoría --';
    categoriaSelectAdd.appendChild(defaultOptionAdd);

    // Añadir las categorías al select de edición
    data.forEach(categoria => {
        let optionEdit = document.createElement('option');
        optionEdit.value = categoria;
        optionEdit.textContent = categoria;
        categoriaSelectEdit.appendChild(optionEdit);
        
        // Añadir las categorías al select de añadir producto
        let optionAdd = document.createElement('option');
        optionAdd.value = categoria;
        optionAdd.textContent = categoria;
        categoriaSelectAdd.appendChild(optionAdd);
    });
})
.catch(error => {
    console.error('Error al obtener las categorías:', error);
});
}

// Función para eliminar un producto
function deleteProduct(id) {
if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
fetch(`/pos/backend/productos/eliminar_producto.php?id_producto=${id}`, {
    method: 'DELETE',  // Usamos el método DELETE para eliminar el producto
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        alert("Producto eliminado exitosamente.");
        obtenerProductos();  // Recargar la lista de productos
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
document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const stock = document.getElementById('stock').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;

    // Enviar los datos al backend para agregar el producto
    fetch('/pos/backend/productos/agregar_producto.php', {
        method: 'POST',
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            stock: stock,
            precio: precio,
            categoria: categoria
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto agregado exitosamente');
            closeAddModal();  // Cerrar el modal
            obtenerProductos();  // Recargar la lista de productos
        } else {
            alert('Error al agregar el producto');
        }
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });
});

// Llamar a la función para obtener los productos cuando se carga la página
window.onload = obtenerProductos;