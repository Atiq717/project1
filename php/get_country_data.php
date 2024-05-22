<?php
header('Content-Type: application/json');

if (isset($_GET['code'])) {
    $countryCode = $_GET['code'];

    $countryBorders = file_get_contents('path_to_your_geojson/countryBorders.geo.json');
    $countryBorders = json_decode($countryBorders, true);

    $countryData = array_filter($countryBorders['features'], function($feature) use ($countryCode) {
        return $feature['properties']['ISO_A2'] === $countryCode;
    });

    echo json_encode(array_values($countryData)[0]);
} else {
    echo json_encode(['error' => 'Country code not provided']);
}
?>
