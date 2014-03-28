<?php
$data = base64_decode($_POST['image']);
//將資料先轉回檔案流表示
$img = imagecreatefromstring($data);
//使用這個可以將剛剛轉的檔案流變成圖片物件
imagejpeg($img, "result.jpg", 90);
//接者存下來就可以了，詳細請看上一篇 http://sudo.tw/article/1388293333/
?>