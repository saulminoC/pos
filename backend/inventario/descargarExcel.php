<?php
// conexion.php
include('../conexion.php');
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment; filename="inventario_sucursal_' . $_GET['sucursal_id'] . '.xls"');

$sucursal_id = $_GET['sucursal_id'];

// Consulta para obtener los productos de la sucursal
$sql = "SELECT id_producto, nombre, descripcion, stock, precio_base, sucursal FROM productos p JOIN producto_sucursal ps ON p.id_producto = ps.id_producto JOIN sucursales s ON ps.id_sucursal = s.id_sucursal WHERE s.id_sucursal = $sucursal_id";
$result = $conn->query($sql);

echo "ID Producto\tNombre\tDescripción\tStock\tPrecio\tSucursal\n"; // Títulos de las columnas

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo $row['id_producto'] . "\t" . $row['nombre'] . "\t" . $row['descripcion'] . "\t" . $row['stock'] . "\t" . $row['precio_base'] . "\t" . $row['sucursal'] . "\n";
    }
} else {
    echo "No hay datos disponibles";
}

$conn->close();
?>
