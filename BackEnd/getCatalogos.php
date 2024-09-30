<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Incluir el archivo de configuración de la base de datos
include_once 'config/db.php';

// Crear una nueva instancia de la clase Database
$database = new Database();
$conn = $database->getConnection();

// Inicializar arrays para almacenar los datos
$departamentos = [];
$clases = [];
$familias = [];

// Recuperar Departamentos
$query = "SELECT DepartamentoID, Nombre FROM Departamentos";
$stmt = $conn->prepare($query);
$stmt->execute();
$departamentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Recuperar Clases
$query = "SELECT ClaseID, Nombre FROM Clases";
$stmt = $conn->prepare($query);
$stmt->execute();
$clases = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Recuperar Familias
$query = "SELECT FamiliaID, Nombre FROM Familias";
$stmt = $conn->prepare($query);
$stmt->execute();
$familias = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Devolver los datos como JSON
echo json_encode([
    'departamentos' => $departamentos,
    'clases' => $clases,
    'familias' => $familias
]);

// Cerrar la conexión
$conn = null;
?>
