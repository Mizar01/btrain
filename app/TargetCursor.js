require("./ACEX/ACEX.js");


class TargetCursor extends ACEX.Actor {
	constructor(t) {
		super()
		this.color = 0x006600
		this.obj = new PIXI.Graphics()
		this.redraw(0.5) //used because of the scaling problem, i need to redraw every time the circle.
		this.obj.position = t
		this.animFrame = 0
		this.animSpeed = 0.5
		this.frames = 20		
	}

	redraw(radius) {
		this.obj.clear()
		this.obj.lineStyle(3, this.color)
		this.obj.drawCircle(0, 0, radius)
	}
	run() {
		var s = this.animFrame + 1
		this.redraw(0.5 * this.animFrame)
		this.obj.alpha = 1 - this.animFrame/20
		this.animFrame = (this.animFrame + this.animSpeed) % this.frames
	}

}

exports.TargetCursor = TargetCursor

