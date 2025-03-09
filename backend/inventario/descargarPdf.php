<?php 
require_once('https://cdnjs.cloudflare.com/ajax/libs/tcpdf/6.4.3/tcpdf.min.js');
include('../conexion.php');

// Verificar si se pasó el parámetro 'sucursal_id'
if (!isset($_GET['sucursal_id'])) {
    die('El parámetro sucursal_id es requerido.');
}

$sucursal_id = $_GET['sucursal_id'];

// Consulta a la base de datos
$sql = "SELECT id_producto, nombre, descripcion, stock, precio_base, sucursal 
        FROM productos p 
        JOIN producto_sucursal ps ON p.id_producto = ps.id_producto 
        JOIN sucursales s ON ps.id_sucursal = s.id_sucursal 
        WHERE s.id_sucursal = $sucursal_id";

$result = $conn->query($sql);

// Verificar si la consulta fue exitosa
if (!$result) {
    die("Error en la consulta: " . $conn->error);
}

// Crear el objeto TCPDF
$pdf = new TCPDF();
$pdf->AddPage();
$pdf->SetFont('Helvetica', '', 12);

// Título
$pdf->Cell(0, 10, 'Reporte de Inventario - Sucursal ' . $sucursal_id, 0, 1, 'C');

// Encabezados
$pdf->Cell(30, 10, 'ID Producto', 1);
$pdf->Cell(40, 10, 'Nombre', 1);
$pdf->Cell(60, 10, 'Descripción', 1);
$pdf->Cell(30, 10, 'Stock', 1);
$pdf->Cell(30, 10, 'Precio', 1);
$pdf->Ln();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $pdf->Cell(30, 10, $row['id_producto'], 1);
        $pdf->Cell(40, 10, $row['nombre'], 1);
        $pdf->Cell(60, 10, $row['descripcion'], 1);
        $pdf->Cell(30, 10, $row['stock'], 1);
        $pdf->Cell(30, 10, $row['precio_base'], 1);
        $pdf->Ln();
    }
} else {
    $pdf->Cell(0, 10, 'No hay datos disponibles', 0, 1, 'C');
}

// Output PDF
$pdf->Output('inventario_sucursal_' . $sucursal_id . '.pdf', 'D');

// Cerrar la conexión
$conn->close();
?>
