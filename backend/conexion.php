<?php
// conexion.php
$host = "localhost"; 
$usuario = "root"; 
$contrasena = ""; 
$base_datos = "paleteria"; 

// Conectar a la base de datos
$conn = new mysqli($host, $usuario, $contrasena, $base_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
