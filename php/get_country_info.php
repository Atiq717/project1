<?php
header('Content-Type: application/json');

if (!isset($_GET['iso_a2'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ISO code not provided']);
    exit();
}

$iso_a2 = $_GET['iso_a2'];
$file_path = 'geojson/countries.geojson';

if (!file_exists($file_path)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit();
}

$data = file_get_contents($file_path);
$json_data = json_decode($data, true);

$country = null;
foreach ($json_data['features'] as $feature) {
    if ($feature['properties']['iso_a2'] === $iso_a2) {
        $country = $feature;
        break;
    }
}

if ($country) {
    echo json_encode($country);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Country not found']);
}
?>
