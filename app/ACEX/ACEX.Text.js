// var Actor = require("./ACEX.Actor.js").Actor

// TODO : BText need an auto refresh timer. It's too complicated call this object from other entities and 
// track where I am using it. It's better to go like Bar with a refreshTimer (and eventually stop the timer)

Text = function(text, color, px, py, icon, clickable, style) {
	Actor.call(this);
	this.obj = new PIXI.Container()
	this.obj.position.set(px, py)
	this.style = style || {
		"size": "35px",
		"font": "Arial",
	}
	this.textObj = this.drawText(text, color)
	this.obj.addChild(this.textObj)
	this.refreshTimer = new CooldownTimer(0.5, true)
	if (icon) {
		this.iconObj = this.drawIcon(icon)
		this.obj.addChild(this.iconObj)
	}
	test_var = this
	if (clickable) {
		// TODO : set the click area size based on the button/text dimensions
		var hitW = text.length * 30
		var hitH = 40
		if (this.iconObj) {
			hitW = 40
		}
		this.setRectHitArea(0, 0, hitW, hitH, true)
		// 
		// this.obj.buttonMode = true
		// this.obj.interactive = true
		// this.obj.hitArea = new PIXI.Rectangle(0, 0, 40, 40)
		// this.obj.mouseup = function(){this._acex_actor.onMouseUp()}
	}

}

Text.extends(Actor, "ACEX.Text")

Text.prototype.run = function() {
	if (this.refreshTimer.trigger()) {
		this.update()
	}
}

Text.prototype.updateText = function(text) {
	this.textObj.text = text
}

Text.prototype.update = function() {}

Text.prototype.mouseup = function() {
	console.warn("The Object is set to clickable, but you must write your own mouseup behavior", this)
}

Text.prototype.drawText = function(text, color) {
	var s = this.style
	var o = new PIXI.Text(text, {
		fontFamily : s.font, 
		fontSize: s.size, 
		fill : color, 
		align : 'center'
	});
	// o.tint = color
	// o.setText(text)
	return o
}

Text.prototype.drawIcon = function(icon) {
	var t = new PIXI.Texture.fromImage(icon)
	var ic = new PIXI.Sprite(t)
	return ic
}

exports.Text = Text	