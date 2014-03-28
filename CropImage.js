function CropImage(canvas, canvas2, imageSrc, darkvalue) {
    var context;
    var context2;
    var image;//一個圖片的物件
    var imageData;//變暗或變亮的圖片
    var IsClick = false;
    var XY = function () {//定義一個XY的類別
        var x;
        var y;
    };
    var Start = new XY();//開始的座標
    var Stop = new XY();//結束的座標
    this.Start = Start;//public 變數
    this.Stop = Stop;//public 變數
    this.init = function () {
        canvas.onmousedown = StartDraw;
        canvas.onmouseup = StopDraw;
        canvas.onmousemove = MouseOnMove;
        canvas.onmouseout = MouseOut;
        context = canvas.getContext("2d");
        context2 = canvas2.getContext("2d");
        image = new Image();
        image.src = imageSrc;
        image.onload = function (event) {
            canvas.width = image.width;
            canvas2.width = image.width;
            canvas.height = image.height;
            canvas2.height = image.height;
  
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            imageData = context.getImageData(0, 0, image.width, image.height);
            var pixels = imageData.data;
            for (var i = 0; i < pixels.length; i += 4) {
                pixels[i] = pixels[i] + darkvalue;
                pixels[i + 1] = pixels[i + 1] + darkvalue;
                pixels[i + 2] = pixels[i + 2] + darkvalue;
                //pixcels[i+3] 第四個位置是保留的
            }
        }
    }
   
    function getEventXY(event) { //取得滑鼠目前的位置
        return {
           "x": event.offsetX * image.width / canvas.offsetWidth,
           "y": event.offsetY * image.height / canvas.offsetHeight
        };
    }
   
    function StartDraw(event) {
        if(IsClick===false){
            var data = getEventXY(event);
            Start.x = data.x;
            Start.y = data.y;
            IsClick = true;
        }
    }
   
    function StopDraw(event) {
        IsClick = false;
        canvas2.width = canvas2.width;
        //上面這個效率比較快，詳細請看下面的MouseOnMove註解
        //context2.clearRect(0, 0, canvas2.width, canvas.height);
        var h = Math.abs(Stop.y - Start.y);
        //Height要為正數
        var w = Math.abs(Stop.x - Start.x);
        //Width也要為正數
        var Temp = new XY(); //設定新的XY座標物件
        Temp.x = (Start.x > Stop.x) ? Stop.x : Start.x;
        Temp.y = (Start.y > Stop.y) ? Stop.y : Start.y;
        //因為drawImage的方法中w, h 不能為負的
        //所以開始的座標要從左上角的座標開始算
        canvas2.width = w;
        canvas2.height = h;
        context2.drawImage(image, Temp.x, Temp.y, w, h, 0, 0, w, h);
    }
   
    function MouseOnMove(event) {
        if (IsClick === true) {
            canvas.width = canvas.width;
            //上面那行是清除舊的CANVAS資料用的
            //當canvas的高或寬變的時候就會整個清除
            //參考這篇，得知這樣的效能比較高
            //http://jsperf.com/ctx-clearrect-vs-canvas-width-canvas-width/2
            //畫框框
            context.strokeStyle = 'gray';
            context.lineWidth = 2;
            var data = getEventXY(event);
            Stop.x = data.x;
            Stop.y = data.y;
            var h = Stop.y - Start.y;
            var w = Stop.x - Start.x;
            context.putImageData(imageData, 0, 0); 
            //將陰暗的圖片先放上去
            //開始DRAW原始沒有變暗的圖片
            //抓到座標只有DRAW框起來的部分
            context.strokeRect(Start.x, Start.y, w, h);
            context.beginPath();
            context.rect(Start.x, Start.y, w, h);
            context.clip();
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }
 
    function MouseOut(event){
        IsClick = false;
        StopDraw(event);
    }
}