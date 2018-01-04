RadiusBar = function(px, py, radius, updateFunction, colorFlux, refreshTime) {
	Bar.call(this, px, py, radius, radius, updateFunction, colorFlux, refreshTime)
	this.radius = radius
}

RadiusBar.extends(Bar, "ACEX.RadiusBar")

RadiusBar.prototype.redraw = function() {
	var p = this.partial
	var t = this.total
	var wp = Math.PI * 2 / t * p
	this.obj.clear()
	// this.obj.beginFill(0x000000, this.alpha)
	// this.obj.lineStyle(2, 0xffffaa)
	// this.obj.drawCircle(0, 0, this.radius)
	// this.obj.endFill()
	this.obj.lineStyle(0)
	var c = this.getColorFill()
	this.obj.lineStyle(14, c, this.alpha)
	// moveTo is a workaround for arc bug !(?)
	this.obj.moveTo(0, - this.radius) //start the arc from the up 
	this.obj.arc(0, 0, this.radius - 4, -Math.PI / 2, wp - Math.PI / 2)
	//this.obj.endFill()
	// the inner circle must obscure the color behind. But
	// after that it must preserve the alpha color for the 
	// game objects under it. So i need two circles.
	this.obj.lineStyle(2, 0xffffff)
	this.obj.beginFill(0x000000, this.alpha)
	this.obj.drawCircle(0, 0, this.radius - 12)
	this.obj.endFill()
}

exports.RadiusBar = RadiusBar