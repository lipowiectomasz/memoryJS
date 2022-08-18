<?php
    $jsonRank = stripslashes($_REQUEST["jsonRank"]);
    $rankingFile = fopen("ranking.json", "w") or die ("Problem with opening.");
    fwrite($rankingFile, $jsonRank);
    fclose($rankingFile);
?>