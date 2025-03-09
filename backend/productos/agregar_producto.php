<?php
include('../conexion.php');

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];
$descripcion = $data['descripcion'];
$stock = $data['stock'];
$precio = $data['precio'];
$categoria = $data['categoria'];
$sucursal_id = $data['sucursal_id'];  // Obtener el id de la sucursal desde el frontend

// Consulta SQL para insertar el producto
$query = "INSERT INTO productos (nombre, descripcion, stock, precio_base, categoria) 
          VALUES ('$nombre', '$descripcion', '$stock', '$precio', '$categoria')";

if ($conn->query($query) === TRUE) {
    // Obtener el id del producto recién insertado
    $id_producto = $conn->insert_id;

    // Insertar la relación en la tabla producto_sucursal
    $query_relacion = "INSERT INTO producto_sucursal (id_producto, id_sucursal) 
                       VALUES ('$id_producto', '$sucursal_id')";

    if ($conn->query($query_relacion) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al insertar la relación del producto']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error al agregar el producto']);
}

// Cerrar la conexión
$conn->close();
?>
