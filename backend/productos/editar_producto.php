<?php
// Conexión a la base de datos
include('../conexion.php');

// Recibir los datos del producto a actualizar
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $id_producto = $data['id_producto'];
    $nombre = $data['nombre'];
    $descripcion = $data['descripcion'];
    $stock = $data['stock'];
    $precio_base = $data['precio_base'];
    $categoria = $data['categoria'];

    // Actualizar el producto
    $query = "UPDATE productos SET nombre = ?, descripcion = ?, stock = ?, precio_base = ?, categoria = ? WHERE id_producto = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssdisi', $nombre, $descripcion, $stock, $precio_base, $categoria, $id_producto);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }

    $stmt->close();
}

$conn->close();
?>
