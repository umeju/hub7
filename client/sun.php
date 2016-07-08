<?php
$url = 'http://www.hubanero.it/big_sun/frontend/web/index.php/get-menu/bm001';
$json = file_get_contents('url_here');
$obj = json_decode($json);
print($obj);
?>
