<?php
// conexion.php
include('../conexion.php');

// Obtener los productos de la sucursal seleccionada
$productos = [];
if (isset($_GET['sucursal_id'])) {
    $sucursal_id = $_GET['sucursal_id'];
    $sql = "
        SELECT p.id_producto, p.nombre, p.descripcion, p.stock, p.precio_base, s.nombre AS sucursal
        FROM productos p
        JOIN producto_sucursal ps ON p.id_producto = ps.id_producto
        JOIN sucursales s ON ps.id_sucursal = s.id_sucursal
        WHERE s.id_sucursal = $sucursal_id
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
    }
}

$conn->close(); // Cerrar la conexión

// Aquí simplemente se muestra el JSON de los productos para el frontend
echo json_encode($productos);
?>
