<?php
        $type = $_GET["type"];
    if($type == "legislators") {
        $response = file_get_contents('http://104.198.0.197:8080/legislators?apikey=478638a5a0b643d3abcb4a8febfe2428&per_page=all');
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin:*');
        echo json_encode($response);
    }
    else if ($type == "fiveCommittees") {
        $bioguide_id = $_GET["bioguide_id"];
        $response = file_get_contents('http://104.198.0.197:8080/committees?member_ids='.$bioguide_id.'&apikey=478638a5a0b643d3abcb4a8febfe2428&per_page=5');
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin:*');
        echo json_encode($response);
    }
    else if($type == "fiveBills"){
        $bioguide_id = $_GET["bioguide_id"];
        $response = file_get_contents('http://104.198.0.197:8080/bills?sponsor_id='.$bioguide_id.'&apikey=478638a5a0b643d3abcb4a8febfe2428&per_page=5');
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin:*');
        echo json_encode($response);
    }
    else if($type == 'activeBills') {
        $response = file_get_contents('http://104.198.0.197:8080/bills?last_version.urls.pdf__exists=true&per_page=50');
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin:*');
        echo json_encode($response);
    }
    else if($type == 'newBills') {
        $response = file_get_contents('http://104.198.0.197:8080/bills?history.active=false&last_version.urls.pdf__exists=true&per_page=50');
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin:*');
        echo json_encode($response);
    }

    else if($type == 'committees') {
        $response = file_get_contents('http://104.198.0.197:8080/committees?apikey=478638a5a0b643d3abcb4a8febfe2428&per_page=all');
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin:*');
        echo json_encode($response);
    }
?>