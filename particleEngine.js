$.Particle = function(bounds, velocity, ttl, engine) {
    this.Bounds = bounds;
	this.Velocity = velocity;
	this.TTL = ttl;
	this.MaxTTL = this.TTL;	
	this.Engine = engine;
}

$.Particle.prototype.Update = function() {
	this.Bounds.Update();	
	
	this.Velocity = new $.Point(
		this.Velocity.X + (this.Engine.Gravity.X * $.Delta),
		this.Velocity.Y + (this.Engine.Gravity.Y * $.Delta));
	this.Bounds.X += this.Velocity.X;
	this.Bounds.Y += this.Velocity.Y;	

	this.TTL -= $.Delta;
}

$.Particle.prototype.Draw = function() {
	if (this.TTL <= 0) { return; }
	
	var percent = 1.0 - this.TTL / this.MaxTTL;
	var color = this.Engine.Colors.GetColor(percent);
		
	$.Gtx.globalAlpha = color.A;
	$.Gtx.fillStyle = color.ToCanvasColor();	
	$.Gtx.fillRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
}


$.ParticleEngine = function() {
	this.Position = new $.Point(0, 0);
	this.Emit = false;
	this.ParticleCount = 100;
	this.TTL = 0.5;
	this.TTLVar = 0.52;
	this.Size = 2;
	this.MaxSize = 4;
	this.Colors = new $.Gradient([ 
		new $.Color(255, 255, 255, 1), 
		new $.Color(0, 0, 0, 0) ])
	this.Angle = 0;
	this.AngleVar = Math.PI	* 2;
	this.MinSpeed = 10;
	this.MaxSpeed = 15;
	this.Gravity = new $.Point(0, 0);
	this.CanBounce = false;
	this.Particles = [];
}

$.ParticleEngine.prototype.Update =  function() {
	if (this.Emit) {
		var spawnCount = this.ParticleCount * $.Delta;
		for (var i = 0; i < spawnCount; i++) {
			this.Spawn((1.0 + i) / spawnCount * $.Delta);
		}
	}
	
	for (var i = 0; i < this.Particles.length; i++){
		if (this.Particles[i].TTL <= 0) {
			this.Particles.splice(i, 1);
			continue;
		}
		
		this.Particles[i].Update();
	}
}

$.ParticleEngine.prototype.Draw =  function() {
	for (var i = 0; i < this.Particles.length; i++) {
		this.Particles[i].Draw();
	}
}

$.ParticleEngine.prototype.Spawn = function(offset) {
	var angle = $.RandomVariation(this.Angle, this.AngleVar);
	var speed = $.RandomBetween(this.MinSpeed, this.MaxSpeed);
	var ttl = $.RandomVariation(this.TTL, this.TTL * this.TTLVar);
	
	x = Math.cos(angle) * speed;
	y = Math.sin(angle) * speed;
	var velocity = new $.Point(x, y);
	var size = $.RandomBetween(this.Size, this.MaxSize);
	var bounds = new $.Rectangle(
		this.Position.X + velocity.X * offset,
		this.Position.Y + velocity.Y * offset,
		size,
		size);
		
	this.Particles.push(new $.Particle(bounds, velocity, ttl, this))
}