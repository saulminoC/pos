<?php
// Encabezado para indicar que la respuesta es JSON
header('Content-Type: application/json');

// Conexión a la base de datos
include('../conexion.php');

// Verificar si la conexión a la base de datos fue exitosa
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// Recibir los datos del producto a actualizar
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si los datos fueron recibidos correctamente
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Datos no recibidos']);
    exit;
}

// Extraer los datos del producto
$id_producto = $data['id_producto'] ?? null;
$nombre = $data['nombre'] ?? null;
$descripcion = $data['descripcion'] ?? null;
$stock = $data['stock'] ?? null;
$precio_base = $data['precio_base'] ?? null;
$categoria = $data['categoria'] ?? null;

// Validar que todos los campos estén presentes
if (!$id_producto || !$nombre || !$descripcion || !$stock || !$precio_base || !$categoria) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

// Actualizar el producto
$query = "UPDATE productos SET nombre = ?, descripcion = ?, stock = ?, precio_base = ?, categoria = ? WHERE id_producto = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Error al preparar la consulta']);
    exit;
}

$stmt->bind_param('ssdisi', $nombre, $descripcion, $stock, $precio_base, $categoria, $id_producto);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al ejecutar la consulta']);
}

$stmt->close();
$conn->close();
?>