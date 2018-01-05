require("./ACEX/ACEX.js")

// TODO:  really the Signal should be extending Blip, and not vice versa.

class Signal extends ACEX.Actor {
	constructor(maxRadius, pos, ok, game) {
		super()
		this.radius = 3
		this.maxRadius = maxRadius
		this.obj = new PIXI.Graphics()
		this.setPosition(pos)
		this.speed = 1
		this.ok = ok
		this.color = (this.ok ? 0x00ff00 : 0xff0000)
	}
	redraw() {
		this.obj.clear()
		this.obj.lineStyle(7, this.color)
		this.obj.drawCircle(0, 0, this.radius)
	}
	run() {
		this.radius += this.speed
		this.redraw(this.radius)
		this.obj.alpha = 1 - this.radius/this.maxRadius
		if (this.radius >= this.maxRadius || this.obj.alpha == 0) {
			this.setForRemoval()
		}
	}
}

class Blip extends Signal {
	constructor(maxRadius, pos, color, game) {
		super(maxRadius, pos, false, game)
		this.radius = 3
		this.maxRadius = maxRadius
		this.obj = new PIXI.Graphics()
		this.setPosition(pos)
		this.speed = 1
		this.color = color || 0xffffff
		// game.vars.cameraShake.refresh = true	
	}
	redraw() {
		this.obj.clear()
		this.obj.lineStyle(10, this.color)
		this.obj.drawCircle(0, 0, this.radius)
	}
	run() {
		this.radius += this.speed
		this.redraw(this.radius)
		this.obj.alpha = 1 - this.radius/this.maxRadius
		if (this.radius >= this.maxRadius || this.obj.alpha == 0) {
			this.setForRemoval()
		}
	}
}



exports.Signal = Signal 
exports.Blip   = Blip