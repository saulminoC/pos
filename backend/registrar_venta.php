<?php
include('conexion.php');

// Recibir el JSON desde la solicitud AJAX
$data_raw = file_get_contents("php://input");

// Verificar si los datos llegaron correctamente
if (!$data_raw) {
    echo json_encode(["success" => false, "message" => "Error: No se recibieron datos válidos."]);
    exit;
}

// Decodificar el JSON correctamente
$data = json_decode($data_raw, true);

// Verificar si la decodificación fue exitosa
if (!is_array($data)) {
    echo json_encode(["success" => false, "message" => "Error al decodificar JSON.", "debug" => $data_raw]);
    exit;
}

// Extraer los valores del JSON
$productos = $data['productos'] ?? [];
$total = $data['total'] ?? 0;
$pagado = $data['pagado'] ?? 0;
$cambio = $data['cambio'] ?? 0;
$id_usuario = 1; // Ajusta según el usuario actual

// Validar que haya productos
if (empty($productos)) {
    echo json_encode(["success" => false, "message" => "Error: No hay productos en la venta."]);
    exit;
}

// Verificar que el usuario exista
$stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = ?");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Error: Usuario no válido."]);
    exit;
}
$stmt->close();

// Registrar la venta
$fecha = date("Y-m-d H:i:s");
$stmt = $conn->prepare("INSERT INTO ventas (id_usuario, fecha, tipo, total) VALUES (?, ?, 'contado', ?)");
$stmt->bind_param("iss", $id_usuario, $fecha, $total);
if ($stmt->execute()) {
    $id_venta = $stmt->insert_id; // Obtener el ID de la venta recién insertada
    $stmt->close();

    // Insertar productos en `detalle_ventas`
    foreach ($productos as $producto) {
        $nombre = $producto['name'];
        $cantidad = $producto['quantity'];
        $precio_unitario = $producto['price'];
        $subtotal = $producto['total'];

        // Obtener id_producto desde la base de datos
        $stmt = $conn->prepare("SELECT id_producto FROM productos WHERE nombre = ? LIMIT 1");
        $stmt->bind_param("s", $nombre);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $id_producto = $row['id_producto'];
            $stmt->close();

            // Insertar en detalle_ventas
            $stmt = $conn->prepare("INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("iiidd", $id_venta, $id_producto, $cantidad, $precio_unitario, $subtotal);
            $stmt->execute();
            $stmt->close();

            // Insertar en movimientos_almacen
            $stmt = $conn->prepare("INSERT INTO movimientos_almacen (id_producto, tipo, cantidad, fecha) VALUES (?, 'salida', ?, ?)");
            $stmt->bind_param("iis", $id_producto, $cantidad, $fecha);
            $stmt->execute();
            $stmt->close();

            // Actualizar stock del producto
            $stmt = $conn->prepare("UPDATE productos SET stock = stock - ? WHERE id_producto = ?");
            $stmt->bind_param("ii", $cantidad, $id_producto);
            $stmt->execute();
            $stmt->close();
        }
    }

    echo json_encode(["success" => true, "message" => "Venta registrada exitosamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar la venta: " . $conn->error]);
}

$conn->close();
?>

