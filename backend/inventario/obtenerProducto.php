<?php
// conexion.php
include('../conexion.php');

// Obtener el producto con el ID proporcionado
if (isset($_GET['id_producto'])) {
    $id_producto = $_GET['id_producto'];
    $sql = "SELECT * FROM productos WHERE id_producto = $id_producto";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Retornar los datos del producto
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Producto no encontrado"]);
    }
}

$conn->close();
?>
