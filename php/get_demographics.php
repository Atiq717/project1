<?php
header('Content-Type: application/json');

if (!isset($_GET['country'])) {
    echo json_encode(['error' => 'Country name not provided']);
    exit();
}

$country = urlencode($_GET['country']);
$restUrl = "https://restcountries.com/v3.1/name/{$country}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $restUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $data = json_decode($response, true);
    if (isset($data[0])) {
        $countryInfo = $data[0];
        $result = [
            'name' => $countryInfo['name']['common'],
            'official_name' => $countryInfo['name']['official'],
            'capital' => isset($countryInfo['capital'][0]) ? $countryInfo['capital'][0] : 'N/A',
            'population' => $countryInfo['population'],
            'area' => $countryInfo['area'],
            'region' => $countryInfo['region'],
            'timezones' => $countryInfo['timezones'],
            'languages' => $countryInfo['languages'],
            'currencies' => $countryInfo['currencies'],
            'calling_code' => $countryInfo['idd']['root'] . implode(', ', $countryInfo['idd']['suffixes']),
            'flag' => $countryInfo['flags']['svg']
        ];
        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'Country not found']);
    }
} else {
    echo json_encode(['error' => 'Failed to fetch data from API']);
}
?>
