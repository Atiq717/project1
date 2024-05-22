<?php
header('Content-Type: application/json');

if (isset($_GET['lat']) && isset($_GET['lon'])) {
    $latitude = $_GET['lat'];
    $longitude = $_GET['lon'];
    $apiKey = 'ba25737d28fb44864b28d72afdc6adef';
    $openWeatherMapBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

    $url = "{$openWeatherMapBaseUrl}?lat={$latitude}&lon={$longitude}&appid={$apiKey}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Failed to fetch data from API']);
    }
} else {
    echo json_encode(['error' => 'Latitude and longitude not provided']);
}
?>
