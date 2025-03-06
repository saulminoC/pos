<?php
// Incluir el archivo de conexión a la base de datos
include('../conexion.php');

// Consulta SQL para obtener todos los productos
$query = "SELECT * FROM productos";
$result = $conn->query($query);

// Verificar si hay productos
if ($result->num_rows > 0) {
    // Crear un array para almacenar los productos
    $productos = [];

    // Recorrer los resultados y agregar cada producto al array
    while ($row = $result->fetch_assoc()) {
        $productos[] = [
            'id_producto' => $row['id_producto'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'stock' => $row['stock'],
            'precio_base' => $row['precio_base'],
            'categoria' => $row['categoria']
        ];
    }

    // Retornar los productos como JSON
    echo json_encode($productos);
} else {
    // Si no hay productos, retornar un mensaje vacío
    echo json_encode([]);
}

// Cerrar la conexión
$conn->close();
?>
