<?php
header('Content-Type: application/json');

$countryBorders = file_get_contents('geojson/countries.geojson');
$countryBorders = json_decode($countryBorders, true);

$countries = array_map(function($feature) {
    return [
        'code' => $feature['properties']['ISO_A2'],
        'name' => $feature['properties']['ADMIN']
    ];
}, $countryBorders['features']);

echo json_encode($countries);
?>
