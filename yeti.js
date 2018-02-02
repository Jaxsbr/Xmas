$.Yeti = function (y, h, w, sinValue) {
	this.Bounds = new $.Rectangle((-1*w), y, w, h);
	this.YetAnimation = new $.Animation($.YetiImage, 4.5, 358, 358, 2);		
	this.YetAnimation.FrameIndex = 0;	
	this.SineTick = 0;
	this.ResetBoundsValue = (-1*w);
	this.SinValue = sinValue;
	
	this.TimeElapsed = 0;	
	// this.TimeShowInterval = 5;
	// this.TimeHideInterval = 10;
	this.TimeCheckInterval = 1;
	
	this.UpdateYeti = false;
};

$.Yeti.prototype.Update = function() {	
	this.TimeElapsed += $.Delta;
	if (this.TimeElapsed >= this.TimeCheckInterval) {
		this.TimeElapsed = 0;
		
		this.UpdateYeti = !this.UpdateYeti;
		
		if (this.UpdateYeti) {
			//this.TimeCheckInterval = this.TimeShowInterval;
		}
		else {
			//this.TimeCheckInterval = this.TimeHideInterval;
		}
		
		this.TimeCheckInterval = $.RandomBetween(10, 60);
	}
	
	this.Bounds.Update();
	
	if (this.UpdateYeti) {			
		this.SineTick++;
		var x = (Math.sin(this.SineTick / this.SinValue) * 2);
		this.Bounds.X += x;	
	}
	else {
		this.SineTick = 0;
		this.Bounds.X = this.ResetBoundsValue;
	}
};

$.Yeti.prototype.Draw = function() {	
	this.YetAnimation.Draw(
		this.Bounds.X, 
		this.Bounds.Y, 
		this.Bounds.Width, 
		this.Bounds.Height);
};