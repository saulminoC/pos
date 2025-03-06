<?php
// obtener_productos.php
include('conexion.php');

// Verificar si se ha enviado la categoría
if (isset($_GET['categoria'])) {
    $categoria = $_GET['categoria'];

    // Consultar los productos de la categoría seleccionada
    $query = "SELECT nombre, precio_base FROM productos WHERE categoria = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $categoria);  // 's' es el tipo de dato para string
    $stmt->execute();
    $result = $stmt->get_result();

    // Crear un array para almacenar los productos
    $productos = [];

    while ($row = $result->fetch_assoc()) {
        $productos[] = [
            'name' => $row['nombre'],
            'price' => $row['precio_base']
        ];
    }

    // Retornar los productos como JSON
    echo json_encode($productos);
}

// Cerrar la conexión
$conn->close();
?>
