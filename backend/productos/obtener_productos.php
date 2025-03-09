<?php
// Incluir el archivo de conexión a la base de datos
include('../conexion.php');

// Obtener el ID de la sucursal desde el parámetro GET
$sucursal_id = isset($_GET['sucursal_id']) ? $_GET['sucursal_id'] : '';

// Verificar si se recibe el parámetro 'sucursal_id'
if (empty($sucursal_id)) {
    echo json_encode(['error' => 'Sucursal no seleccionada']);
    exit;  // Detener la ejecución si no se recibe sucursal_id
}

// Continúa con la consulta SQL para obtener los productos
$query = "
    SELECT p.id_producto, p.nombre, p.descripcion, p.stock, p.precio_base, p.categoria
    FROM productos p
    JOIN producto_sucursal ps ON p.id_producto = ps.id_producto
    WHERE ps.id_sucursal = $sucursal_id
";
$result = $conn->query($query);

// Verificar si hay productos
if ($result->num_rows > 0) {
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = [
            'id_producto' => $row['id_producto'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'stock' => $row['stock'],
            'precio_base' => $row['precio_base'],
            'categoria' => $row['categoria']
        ];
    }
    echo json_encode($productos);  // Retornar los productos
} else {
    echo json_encode([]);  // Si no hay productos, retornar un arreglo vacío
}

// Cerrar la conexión
$conn->close();

?>
