<?php
header('Content-Type: application/json');

if (isset($_GET['country'])) {
    $country = urlencode($_GET['country']);
    $apiKey = '05beac2d1f7a4d3fa05a988c241230a1';
    $newsApiUrl = "https://newsapi.org/v2/everything?q={$country}&sortBy=publishedAt&apiKey={$apiKey}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $newsApiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'MyApp/1.0');
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response) {
        $data = json_decode($response, true);
        if (isset($data['articles']) && count($data['articles']) > 0) {
            $news = array_slice($data['articles'], 0, 3); // Get only the first 3 stories
            $result = [];
            foreach ($news as $article) {
                $result[] = [
                    'name' => $article['source']['name'],
                    'author' => $article['author'],
                    'title' => $article['title'],
                    'description' => $article['description'],
                    'url' => $article['url'],
                    'publishedAt' => $article['publishedAt']
                ];
            }
            echo json_encode($result);
        } else {
            echo json_encode(['error' => 'No news found']);
        }
    } else {
        echo json_encode(['error' => 'Failed to fetch data from API']);
    }
} else {
    echo json_encode(['error' => 'Country name not provided']);
}
?>
