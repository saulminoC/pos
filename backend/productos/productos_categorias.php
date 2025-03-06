<?php
// productos_categorias.php
include('../conexion.php');

// Consulta para obtener las categorías
$query = "SELECT DISTINCT categoria FROM productos";
$result = $conn->query($query);

// Crear un array para las categorías
$categorias = [];

while ($row = $result->fetch_assoc()) {
    $categorias[] = $row['categoria'];
}

// Retornar las categorías como JSON
echo json_encode($categorias);

// Cerrar la conexión
$conn->close();
?>
