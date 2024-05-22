<?php
header('Content-Type: application/json');

if (isset($_GET['currency_code'])) {
    $currencyCode = $_GET['currency_code'];
    $apiKey = 'a37ab710bf124bce8c2cfaabc4c3b706';
    $openExchangeUrl = "https://openexchangerates.org/api/latest.json?app_id={$apiKey}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $openExchangeUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response) {
        $data = json_decode($response, true);
        if (isset($data['rates'][$currencyCode])) {
            echo json_encode(['rate' => $data['rates'][$currencyCode]]);
        } else {
            echo json_encode(['error' => 'Currency code not found']);
        }
    } else {
        echo json_encode(['error' => 'Failed to fetch data from API']);
    }
} else {
    echo json_encode(['error' => 'Currency code not provided']);
}
?>
