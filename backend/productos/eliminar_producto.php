<?php
// eliminar_producto.php

// Conexión a la base de datos
include('../conexion.php');

// Obtener el ID del producto que se quiere eliminar
$id_producto = $_GET['id_producto'];

if ($id_producto) {
    // Consulta SQL para eliminar el producto
    $query = "DELETE FROM productos WHERE id_producto = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_producto);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "No se pudo eliminar el producto."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "ID de producto no proporcionado."]);
}
?>
