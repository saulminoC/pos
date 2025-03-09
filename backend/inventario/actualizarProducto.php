<?php
// conexion.php
include('../conexion.php');

// Obtener los datos del producto desde la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id_producto'], $data['nombre'], $data['descripcion'], $data['stock'], $data['precio_base'])) {
    $id_producto = $data['id_producto'];
    $nombre = $data['nombre'];
    $descripcion = $data['descripcion'];
    $stock = $data['stock'];
    $precio_base = $data['precio_base'];

    // Actualizar el producto en la base de datos
    $sql = "UPDATE productos SET nombre = '$nombre', descripcion = '$descripcion', stock = $stock, precio_base = $precio_base WHERE id_producto = $id_producto";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

$conn->close();
?>
