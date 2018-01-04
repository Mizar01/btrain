Bubble = function(text, color, pos) {
	ACEX.Actor.call(this)
	this.textActor = null
	this.obj = null
	this.draw(text, color)
	this.setPosition(pos)
}

Bubble.extends(ACEX.Actor, "Bubble")

Bubble.prototype.run = function() {
	this.obj.position.y--
	this.textActor.textObj.alpha-= 0.02
	if (this.textActor.textObj.alpha >= 1){
		this.setForRemoval()
	}
}

Bubble.prototype.draw = function(text, c) {
	var o = new PIXI.Graphics()
	var size = 20
	var center = size * text.length / 6 
	var t = new ACEX.Text(text, c, - center, 0, null, false, {size: size + "px", font: game.font})
	this.obj = o
	this.addChild(t)
	this.textActor = t
}