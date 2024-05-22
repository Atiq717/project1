<?php
header('Content-Type: application/json');

if (isset($_GET['country'])) {
    $country = trim($_GET['country']);
    $joinedCountry = str_replace(" ", "_", $country);
    $wikiUrl = "https://en.wikipedia.org/wiki/" . $joinedCountry;
    echo json_encode(['wikiUrl' => $wikiUrl]);
} else {
    echo json_encode(['error' => 'Country name not provided']);
}
?>
