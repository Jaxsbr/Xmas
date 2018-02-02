$.Init = function () {
    $.InitRequestAnimationFrame();
    $.InitWindowEvents();
    $.InitGameVariables();
    $.InitCanvas();

	$.ObjectLoaded = false;
	$.LoadImages();
    $.GameLoop();
};

$.InitRequestAnimationFrame = function () {
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
};

$.InitWindowEvents = function () {
    window.addEventListener('mousemove', $.MouseMove);
    window.addEventListener('mousedown', $.MouseDown);
    window.addEventListener('mouseup', $.MouseUp);
    window.addEventListener('keydown', $.KeyDown);
    window.addEventListener('keyup', $.KeyUp);
    window.addEventListener("keypress", $.KeyPress);
    window.addEventListener('resize', $.Resize);    
};

$.InitGameVariables = function () {
    $.Keys = [];
    $.KeyCodes = { A: 65, D: 68, S: 83, W: 87, ESC:27, ENTER: 13, SHIFT: 16, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    $.MousePoint = new $.Point(0, 0);
    $.IsMouseDown = false;
    $.Delta = 0;
    $.Then = Date.now();
	
	$.SnowFlakeElapsed = 0;
	$.SnowFlakeInterval = $.RandomBetween(0.1, 1);
	$.SnowFlakes = [];		
};

$.InitCanvas = function () {
    $.CanvasWidth = window.innerWidth;
    $.CanvasHeight = window.innerHeight;
    $.CanvasBounds = new $.Rectangle(0, 0, $.CanvasWidth, $.CanvasHeight);

    $.Canvas = document.getElementById('canvas');
    $.Canvas.width = $.CanvasWidth;
    $.Canvas.height = $.CanvasHeight;
    $.Canvas.style.marginTop = -$.CanvasHeight / 2 + 'px';
    $.Canvas.style.marginLeft = -$.CanvasWidth / 2 + 'px';

    $.Gtx = $.Canvas.getContext('2d');
};


$.MouseMove = function (e) {
    if ($.GameStates.Play == 1) {
        $.MousePoint = new $.Point(e.clientX - $.Canvas.offsetLeft, e.clientY - $.Canvas.offsetTop);
    }
};

$.MouseDown = function () {
    $.IsMouseDown = true;
};

$.MouseUp = function () {
    $.IsMouseDown = false;
};

$.KeyDown = function (e) {
    $.Keys[e.keyCode] = true;

    if ($.Keys[$.KeyCodes.ESC]) {
        if ($.GameStates.Play == 1) {
            $.MenuPauseGame();
        }
    }
};

$.KeyUp = function (e) {
    $.Keys[e.keyCode] = false;
};

$.KeyPress = function (e) {

};

$.Resize = function () {
    $.InitCanvas();
};


$.LoadImages = function () {
    $.ImageCount = 5;
    $.ImagesLoaded = 0;   

	$.TreeImage = new Image();
	$.TreeImage.onload = function () { $.ImagesLoaded++; }
	$.TreeImage.src = 'tree.png';
	
	$.SnowFlakeImage = new Image();
	$.SnowFlakeImage.onload = function () { $.ImagesLoaded++; }
	$.SnowFlakeImage.src = 'snowFlake.png';

	$.SantaImage = new Image();
	$.SantaImage.onload = function () { $.ImagesLoaded++; }
	$.SantaImage.src = 'santa.png';
	
	$.BackImage = new Image();
	$.BackImage.onload = function () { $.ImagesLoaded++; }
	$.BackImage.src = 'background.png';
	
	$.YetiImage = new Image();
	$.YetiImage.onload = function () { $.ImagesLoaded++; }
	$.YetiImage.src = 'yeti1.png';
};

$.IsLoading = function () {
    if ($.ImagesLoaded == $.ImageCount) {
		return false;
    }
	return true;
};

$.GameLoop = function () {
    requestAnimationFrame($.GameLoop);
    $.UpdateDelta();

	if (!$.IsLoading()){		
		if (!$.ObjectLoaded) {			
			$.ObjectSetup();
		}
		$.UpdateGame();
		$.DrawGame();
	}
};

$.ObjectSetup = function(){
	$.Trees = [];
	var zScale = 0;
	
	for (var i = 0; i < 30; i++) {
		var x = $.RandomBetween(50, $.CanvasBounds.Width - 50);
		var y = $.RandomBetween(250, $.CanvasBounds.Height - 50);
		
		zScale = y * 100 / $.CanvasBounds.Height;				
		$.Trees.push(new $.Tree(x, y, 100 + (zScale * 2), 250 + (zScale * 2)));		
	}		
		
	for	(var i = 0; i < 20; i++) {
		$.SnowFlakes.push(new $.SnowFlake());
	}
	
	$.SnowFlakes.sort(function(a, b) {
		return parseFloat(a.Y) - parseFloat(b.Y);
	});	
	
	$.MRClause = new $.Santa();
	$.MRYeti = new $.Yeti(400, 358, 358, 70);
	$.MRYeti2 = new $.Yeti(100, 200, 200, 30);
		
	$.ObjectLoaded = true;	
};

$.UpdateDelta = function () {	
    var now = Date.now();
    var delta = now - $.Then;
    $.Delta = delta / 1000;
    $.Then = now;
};

$.UpdateGame = function () {	
	$.UpdateSnowFlakes();
	
	$.MRClause.Update();
	
	for (var i = 0; i < $.Trees.length; i++) {	
		$.Trees[i].Update($.MRClause.Bounds);		
	}
	
	$.MRYeti.Update();
	$.MRYeti2.Update();
};

$.UpdateSnowFlakes = function () {
	$.SnowFlakeElapsed += $.Delta;
	if ($.SnowFlakeElapsed >= $.SnowFlakeInterval) {
		$.SnowFlakeElapsed = 0;
		$.SnowFlakeInterval = $.RandomBetween(0.1, 1);
		$.SpawnSnowFlake();
	}	
	for (var i = 0; i < $.SnowFlakes.length; i++) {
		$.SnowFlakes[i].Update();
	}
};

$.SpawnSnowFlake = function () {
	for (var i = 0; i < $.SnowFlakes.length; i++) {
		if ($.SnowFlakes[i].TTL <= 0) {
			$.SnowFlakes[i].Reset();
			break;
		}
	}
};

$.DrawGame = function () {
	
	$.Gtx.clearRect($.CanvasBounds.X, $.CanvasBounds.Y, $.CanvasBounds.Width, $.CanvasBounds.Height);
	
	$.Gtx.drawImage($.BackImage, $.CanvasBounds.X, $.CanvasBounds.Y, $.CanvasBounds.Width, $.CanvasBounds.Height);
	
	$.MRClause.Draw();	
	
	for (var i = 0; i < $.Trees.length; i++) {	
		$.Trees[i].Draw();		
	}
	
	$.MRYeti.Draw();
	$.MRYeti2.Draw();
	
	for (var i = 0; i < $.SnowFlakes.length; i++) {
		$.SnowFlakes[i].Draw();
	}
};