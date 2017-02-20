window.onload = function(){  
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
    	clear_btn = document.getElementById("clear_btn"),
        color_btns = document.getElementsByName("color_btn"),

        isMouseDown = false,
        lastLoc = {x: 0, y: 0},
        lastTimestamp = 0,
        lastLineWidth = -1,
        strokeColor = "black",

        w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        canvasWidth = Math.min(600, Math.min(w, h) - 40),
        canvasHeight = canvasWidth;

    //设置宽高
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    //绘制背景
    drawGrid();

    //清空画布
    clear_btn.onclick = function() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrid();
    };

    //选择颜色
    for(var i = 0; i < color_btns.length; i++) {
        color_btns[i].onclick = function() {
            
            for(var t = 0; t < color_btns.length; t++) {
                color_btns[t].className = "color_btn";
            }
            this.className = "color_btn_selected color_btn";
            strokeColor = this.id;
            //console.log(strokeColor);
        }
    }

    //添加鼠标事件
    function beginStroke(point) {
        isMouseDown = true;
        lastLoc = windowToCanvas(point.x, point.y);
        lastTimestamp = new Date().getTime();
    }
    function endStroke() {
        isMouseDown = false;
    }
    function moveStroke(point) {
        var curLoc = windowToCanvas(point.x, point.y),
            curTimestamp = new Date().getTime(),
            s = calcDistance(curLoc, lastLoc),
            t = curTimestamp - lastTimestamp,
            lineWidth = calcLineWidth(t, s);

        //draw
        context.beginPath();
        context.moveTo(lastLoc.x, lastLoc.y);
        context.lineTo(curLoc.x, curLoc.y);
        context.strokeStyle = strokeColor;
        context.lineWidth = lineWidth;
        //console.log(context.lineWidth);
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();

        lastLoc = curLoc;
        curTimestamp = lastTimestamp;
        lastLineWidth = lineWidth;
     }

    canvas.onmousedown = function(e) {
        preventDefault(e);
        beginStroke({x: e.clientX, y: e.clientY});
    };
    canvas.onmouseup = function(e) {
        preventDefault(e);
        endStroke();
    };
    canvas.onmouseout = function(e) {
        preventDefault(e);
        endStroke();
    };
    canvas.onmousemove = function(e) {
        preventDefault(e);
        if(isMouseDown) {
            moveStroke({x:e.clientX, y:e.clientY});
       }
    };

    //添加触控事件
    canvas.addEventListener('touchstart', function(e){
        preventDefault(e);
        touch = e.touches[0];
        beginStroke({x: touch.pageX, y: touch.pageY});
    });
    canvas.addEventListener('touchmove', function(e){
        preventDefault(e);
        if(isMouseDown){
            touch = e.touches[0];
            moveStroke({x: touch.pageX, y: touch.pageY})
        }
    });
    canvas.addEventListener('touchend', function(e){
        preventDefault(e);
        endStroke();
    });

    //阻止事件冒泡
    function preventDefault(e) {
        e = e || window.event;
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
        }
    }

    //调整画笔宽度
    var maxLineWidth = 25,
        minLineWidth = 1,
        maxStrokeV = 10,
        minStrokeV = 0.1;
    function calcLineWidth(t , s ) {
        var v = s / t;
        var resultLineWidth;
        if( v <= minStrokeV )
            resultLineWidth = maxLineWidth;
        else if ( v >= maxStrokeV )
            resultLineWidth = minLineWidth;
        else{
            resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth) * 25;
        }

        if( lastLineWidth == -1 )
            return resultLineWidth;

        return resultLineWidth*1/3 + lastLineWidth*2/3;
    }

    //计算移动时两点距离
    function calcDistance(loc1, loc2) {
        return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
    }

    //将坐标原点从window移动到canvas
    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)}
    }

    //绘制背景
    function drawGrid() {
    	context.save();
    	//绘制边框
	    context.strokeStyle = "rgb(230, 11, 9)";
	    context.beginPath();
	    context.moveTo(3, 3);
	    context.lineTo(canvasWidth - 3, 3);
	    context.lineTo(canvasWidth - 3, canvasWidth - 3);
	    context.lineTo(3, canvasWidth - 3);
	    context.closePath();
	    context.lineWidth = 6;
	    context.stroke();
	    //绘制米字
	    context.beginPath();
	    context.moveTo(0, 0);
	    context.lineTo(canvasWidth, canvasWidth);
	    context.moveTo(canvasWidth, 0);
	    context.lineTo(0, canvasWidth);
	    context.moveTo(canvasWidth / 2, 0);
	    context.lineTo(canvasWidth / 2, canvasWidth);
	    context.moveTo(0, canvasWidth / 2);
	    context.lineTo(canvasWidth, canvasWidth / 2);
	    context.lineWidth = 1;
	    context.stroke();

	    context.restore();
	}
}

