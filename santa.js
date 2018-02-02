$.Santa = function() {
	this.SineTick = 0;
	this.Bounds = new $.Rectangle(0,0,0,0);	
	this.Reset();	
	this.SetupParticles();
};

$.Santa.prototype.Reset = function() {
	var x = $.CanvasBounds.Width + 125;
	var y = 100;
	
	this.SineVal = $.RandomBetween(25, 50);
	this.Bounds.X = x;
	this.Bounds.Y = y; 
	this.Bounds.Width = 250;
	this.Bounds.Height = 230;
			
	this.SantaAnimation = new $.Animation($.SantaImage, 0.2, 125, 115, 2);
	this.SantaAnimation.FrameIndex = 0;		
};

$.Santa.prototype.SetupParticles = function() {
	this.Gifts = new $.ParticleEngine();
    this.Gifts.Position = new $.Point(this.Bounds.X, this.Bounds.Y);
    this.Gifts.Emit = true;
    this.Gifts.ParticleCount = 15;
    this.Gifts.TTL = 1.2;
    this.Gifts.TTLVar = 1.22;
    this.Gifts.Size = 5;
    this.Gifts.MaxSize = 8;
    this.Gifts.Colors = new $.Gradient([
		new $.Color(0, 255, 0, 1),
        new $.Color(255, 0, 0, 0.8),
		new $.Color(0, 0, 255, 0.6)]);
    this.Gifts.Angle = 0;
    this.Gifts.AngleVar = Math.PI * 2;
    this.Gifts.MinSpeed = 0.5;
    this.Gifts.MaxSpeed = 0.9;
    this.Gifts.Gravity = new $.Point(0, 1);
    this.Gifts.CanBounce = false;
};

$.Santa.prototype.Update = function() {	
	this.Bounds.Update();		
	
	this.SineTick++;
	var y = (Math.sin(this.SineTick / this.SineVal) * 2);
	this.Bounds.Y += y;	
	this.Bounds.X -= 5;

	this.Gifts.Position.X = this.Bounds.Centre.X;
    this.Gifts.Position.Y = this.Bounds.Centre.Y;
    this.Gifts.Update();
	
	// If MR clause is +- 400 to the left of the visible screen, reset him to the right.
	if (this.Bounds.X <= -400) {
		this.Reset();
	}
};

$.Santa.prototype.Draw = function() {	
	$.Gtx.save();
	this.Gifts.Draw();
	$.Gtx.restore();

	this.SantaAnimation.Draw(
		this.Bounds.X, 
		this.Bounds.Y, 
		this.Bounds.Width, 
		this.Bounds.Height);
};