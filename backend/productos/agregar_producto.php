<?php
include('../conexion.php');

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];
$descripcion = $data['descripcion'];
$stock = $data['stock'];
$precio = $data['precio'];
$categoria = $data['categoria'];

// Consulta SQL para insertar el producto
$query = "INSERT INTO productos (nombre, descripcion, stock, precio_base, categoria) 
          VALUES ('$nombre', '$descripcion', '$stock', '$precio', '$categoria')";

if ($conn->query($query) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al agregar el producto']);
}

// Cerrar la conexión
$conn->close();
?>
