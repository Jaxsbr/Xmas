$.Tree = function(x, y, width, height) {	
	this.Bounds = new $.Rectangle(x, y, width, height);
	this.Moving = false;
	
	this.Direction = 0; // 0 left   1 right
	this.Tilt = 0;	
	this.MaxTilt = 3;
	this.NextTilt = this.MaxTilt;
	this.TiltElapsed = 0;
	this.TiltTick = 0.01;
};


$.Tree.prototype.Update = function(mrClauseBounds) {
	this.Bounds.Update();	
	this.UpdateMovement(mrClauseBounds);
};

$.Tree.prototype.UpdateMovement = function(colissionBounds) {	
	if (this.Moving) {
		// TODO:
		// Add tree shaking effect.
		// Decelerate shaking value.
		// Set moving to false when shaking stops.
		
		this.TiltElapsed += $.Delta;
		if (this.TiltElapsed >= this.TiltTick) {
			this.TiltElapsed = 0;
			
			if (this.Direction == 0) { // Left Tilt
				this.Tilt -= 0.2;
			}
			else if (this.Direction == 1) { // Right Tilt
				this.Tilt += 0.2;
			}
		}
		
		if ((this.Direction == 0 && this.Tilt <= -this.NextTilt) ||
		    (this.Direction == 1 && this.Tilt >= this.NextTilt)) {
				this.NextTilt -= 1;
				this.Direction = this.Direction == 0 ? 1 : 0;
		}

		if (this.NextTilt <= 0) {
			this.NextTilt = this.MaxTilt;
			this.Direction = 0;
			this.Tilt = 0;
			this.Moving = false;
		}
	}
	else {
		if (colissionBounds.IntersectRect(this.Bounds)) {
			this.Moving = true;
		}	
	}
};

$.Tree.prototype.Draw = function() {
	$.Gtx.save();
	$.Gtx.translate(this.Bounds.Centre.X, this.Bounds.Bottom);
	$.Gtx.rotate($.ToRadians(this.Tilt));	
	$.Gtx.drawImage(
		$.TreeImage, 
		-(this.Bounds.Width / 2), 
		-(this.Bounds.Height), 
		this.Bounds.Width, 
		this.Bounds.Height);
	$.Gtx.restore();
};