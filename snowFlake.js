$.SnowFlake = function() {
	this.MaxTTL = 10;		
	this.TTL = 0;
	this.SineTick = 0;
	this.Spin = 0;
	this.DownSpeed = $.RandomBetween(0.5, 3.5);
};

$.SnowFlake.prototype.Reset = function() {
	this.TTL = this.MaxTTL;
	
	var size = $.RandomBetween(20, 50);
	var x = $.RandomBetween(0, $.CanvasBounds.Width);
	
	this.SineVal = $.RandomBetween(25, 50);
	this.Bounds = new $.Rectangle(x, 10, size, size);
	this.Opacity = 1;
};

$.SnowFlake.prototype.Update = function() {
	if (this.TTL <= 0) {
		return;
	}
	
	this.Bounds.Update();
	
	this.TTL -= $.Delta;
	
	this.Opacity = this.MaxTTL / 100 * this.TTL;
	
	this.Bounds.Y += this.DownSpeed;
	
	this.SineTick++;
	this.Bounds.X += (Math.sin(this.SineTick / this.SineVal) * 2);
	
	this.Spin += 0.05;
};

$.SnowFlake.prototype.Draw = function() {
	if (this.TTL <= 0) {
		return;
	}
	
	$.Gtx.save();
	$.Gtx.translate(this.Bounds.Centre.X, this.Bounds.Centre.Y);
	$.Gtx.rotate(this.Spin);
	$.Gtx.globalAlpha = this.Opacity;				
	$.Gtx.drawImage(
		$.SnowFlakeImage, 
		-(this.Bounds.Width / 2), 
		-(this.Bounds.Height / 2), 
		this.Bounds.Width, 
		this.Bounds.Height);
	$.Gtx.restore();
};