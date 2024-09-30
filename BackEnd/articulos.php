<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type");

include_once 'config/db.php';
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    die("Conexión fallida: " . mysqli_connect_error());
}

$database = new Database();
$conn = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['sku'])) {
            // Consulta un artículo por SKU
            $sku = $_GET['sku'];
            $query = "CALL ConsultarArticulo(:sku)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':sku', $sku);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($result) {
                echo json_encode($result);
            } else {
                echo json_encode(['message' => 'Artículo no encontrado']);
            }
        }
        break;

    case 'POST':
        // Alta de un nuevo artículo
        $data = json_decode(file_get_contents("php://input"));

        if (
            !empty($data->sku) &&
            !empty($data->articulo) &&
            !empty($data->marca) &&
            !empty($data->modelo) &&
            !empty($data->departamento) &&
            !empty($data->clase) &&
            !empty($data->familia) &&
            !empty($data->stock) &&
            !empty($data->cantidad)
        ) {
            $query = "CALL AltaArticulo(:sku, :articulo, :marca, :modelo, :departamento, :clase, :familia, :cantidad, :stock)";
            $stmt = $conn->prepare($query);

            // Enlazar parámetros
            $stmt->bindParam(':sku', $data->sku);
            $stmt->bindParam(':articulo', $data->articulo);
            $stmt->bindParam(':marca', $data->marca);
            $stmt->bindParam(':modelo', $data->modelo);
            $stmt->bindParam(':departamento', $data->departamento);
            $stmt->bindParam(':clase', $data->clase);
            $stmt->bindParam(':familia', $data->familia);
            $stmt->bindParam(':cantidad', $data->cantidad);
            $stmt->bindParam(':stock', $data->stock);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Artículo creado exitosamente']);
            } else {
                echo json_encode(['message' => 'Error al crear el artículo']);
            }
        } else {
            echo json_encode(['message' => 'Datos incompletos']);
        }
        break;

    case 'PUT':
        // Cambio de un artículo existente
        $data = json_decode(file_get_contents("php://input"));
        if (isset($_GET['sku'])) {
            $sku = $_GET['sku'];

            $query = "CALL CambiarArticulo(:sku, :articulo, :marca, :modelo, :departamento, :clase, :familia, :cantidad, :stock, :descontinuado)";
            $stmt = $conn->prepare($query);

            // Enlazar parámetros
            $stmt->bindParam(':sku', $sku);
            $stmt->bindParam(':articulo', $data->articulo);
            $stmt->bindParam(':marca', $data->marca);
            $stmt->bindParam(':modelo', $data->modelo);
            $stmt->bindParam(':departamento', $data->departamento);
            $stmt->bindParam(':clase', $data->clase);
            $stmt->bindParam(':familia', $data->familia);
            $stmt->bindParam(':cantidad', $data->cantidad);
            $stmt->bindParam(':stock', $data->stock);
            $stmt->bindParam(':descontinuado', $data->descontinuado);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Artículo actualizado']);
            } else {
                echo json_encode(['message' => 'Error al actualizar el artículo']);
            }
        } else {
            echo json_encode(['message' => 'SKU no proporcionado']);
        }
        break;

    case 'DELETE':
        // Baja de un artículo
        if (isset($_GET['sku'])) {
            $sku = $_GET['sku'];

            $query = "CALL BajaArticulo(:sku)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':sku', $sku);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Artículo eliminado']);
            } else {
                echo json_encode(['message' => 'Error al eliminar el artículo']);
            }
        } else {
            echo json_encode(['message' => 'SKU no proporcionado']);
        }
        break;

    default:
        echo json_encode(['message' => 'Método no soportado']);
        break;
}
?>
