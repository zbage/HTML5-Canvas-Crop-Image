var pCanvas1 = document.getElementById("pCanvas1");
var pCanvas2 = document.getElementById("pCanvas2");
var ImageForCanvas = document.getElementById("ImageForCanvas");
var cropImage = 
    new CropImage(pCanvas1, pCanvas2, "test.jpg", 80);
cropImage.init();
//cropImage.Start.x 開始的X座標
//cropImage.Start.y 開始的Y座標
//cropImage.Stop.x  結束的X座標
//cropImage.Stop.y  結束的Y座標
 
document.getElementById("btnGo").onclick = function (event) {
    ImageForCanvas.src = pCanvas2.toDataURL("image/jpeg");//預設image/png
    var formdata = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "upload.php");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
           // console.log(this.responseText);
        }
    };
    var image = ImageForCanvas.src;
 
    formdata.append('image', image.split(",")[1]);
    //資料採用Base64編碼，絕對不會有逗號 所以 我們可以放心地抓第1筆資料
    //第0筆資料為 data/jpeg;base64
    xhr.send(formdata);
}