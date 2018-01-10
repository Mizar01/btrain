require("./ACEX/ACEX.js");

const Signal = require("./signals").Signal
const Blip = require("./signals").Blip


class Dot extends ACEX.Actor {
	
	constructor(x, y, colorCode, game) {
		super()
		this.game = game
		this.obj = null
		this.colorCode = colorCode

		this.size = this.game.vars.grid.res * 0.9 // can be ovverridden by draw method
		this.draw(this.colorCode)

		this.setPosition(this.game.vars.grid.cellToGrid({x: x, y: y}, true))
	
		this.nextMoveTimer = new ACEX.CooldownTimer(0.75, true)	

		this.speed = 0.5
		// this.speed = 10
		this.moveTimer = new ACEX.CooldownTimer(1/this.speed, true)
		
		this.stop = false

		this.targetPath = null


	}

	draw(colorCode) {

		let colorMap = { R: "red", G: "green", B: "blue", P: "purple"  }
		let grid = this.game.vars.grid
		let r = grid.res
		let size = 	this.size

		var o = new PIXI.Graphics()
		// o.beginFill(ACEX.Utils.getHexColor(colorMap[colorCode]))
		// o.drawRect(-size/2, -size/2, size, size)
		// o.endFill()
		let sp = new PIXI.Sprite(PIXI.loader.resources.dotPng.texture)
		sp.x = sp.y = -size/2
		sp.width = sp.height = size
		sp.tint = ACEX.Utils.getHexColor(colorMap[colorCode])
		sp.tintCycle = 0
		o.addChild(sp)
		o.sprite = sp

		this.obj = o
	}

	run() {
		if (this.stop) {
			return
		}
		// if (this.nextMoveTimer.trigger()) {
		// 	this.moveToNext()
		// }
		this.move()
	}

	move() {

		if (this.targetPath == null) {
			this.setNewTarget()
			return
		}

		// Check if a switch has been set differently during the walk on it
		// and change the targetPath accordingly on the fly.
		let cp = this.getRealCurrentPath()
		if (cp.isSwitch && cp != this.targetPath) {
			let switchNext = cp.getNext()
			if (switchNext != this.targetPath) {
				this.targetPath = switchNext 
			}
		}

		let tpPos = this.targetPath.centerPosition
		if (ACEX.Utils.pointDistance(this.obj.position, tpPos) < 8 ) {
			//this.setPosition(tp)
			this.setNewTarget()
		}
		this.followPoint(tpPos, this.speed, false)

	}

	setNewTarget() {

		// let lp = this.logicPosition
		// let grid = this.game.vars.grid
		// let currentPath = grid.paths[lp.x][lp.y]

		let cPath = this.getRealCurrentPath()

		if (cPath.isHouse) {
			this.setScore(this.evalPoints(cPath))
			this.stop = true
			this.setForRemoval()
			return
		}

		let nPath = cPath.getNext()
		this.targetPath = nPath

	}

	/**
	* Get the real cell grid based on position
	*/
	getRealCurrentPath() {
		let tp = this.obj.position
		return this.game.vars.grid.getPathByPos(tp.x, tp.y)
	}

	evalPoints(currentPath) {
		return (currentPath.code == this.colorCode) ? 1 : -1
	}

	setScore(points) {
		let isOk = (points >= 0) ? true : false
		if (points >= 0) {
			this.game.correct+=points
		} else {
			this.game.wrong+=Math.abs(points)
		}
		this.game.updateScore()
		this.game.gameLayer.addChild(
			new Signal(
				100,
				this.obj.position, 
				isOk, 
				this.game
			)
		)
	}

	// moveToNext() {

	// 	let lp = this.logicPosition
	// 	let grid = this.game.vars.grid
	// 	let currentPath = grid.paths[lp.x][lp.y]

	// 	if (currentPath.constructor.name == "House") {
	// 		console.log("Dot ended its path")
	// 		if (currentPath.code == this.colorCode) {
	// 			//console.log("OK !!!")
	// 			this.game.correct++
	// 		} else {
	// 			this.game.wrong++
	// 		}
	// 		this.stop = true
	// 		this.setForRemoval()
	// 		this.game.updateScore()
	// 		return
	// 	}
 
	// 	let dir = currentPath.getDirection()
	// 	let np = {x: lp.x + dir[0], y: lp.y + dir[1]}
	// 	this.logicPosition = np
	// 	this.setPosition(this.game.vars.grid.cellToGrid(np))
	// }


}

class Death extends Dot {
	
	constructor(x, y, colorCode, game) {
		super(x, y, colorCode, game)
		let s = this.size
		this.setRectHitArea(- s / 2, - s / 2, s, s, false)
	}

	draw() {

		let grid = this.game.vars.grid
		let r = grid.res
		this.size = r * 1
		let size = this.size

		var o = new PIXI.Graphics()

		let sp = new PIXI.Sprite(PIXI.loader.resources.deathPng.texture)
		sp.x = sp.y = -size/2
		sp.width = sp.height = size
		sp.tint = 0xff0000
		sp.tintCycle = 0
		o.addChild(sp)
		o.sprite = sp

		this.obj = o		
	}

	mouseup(ev) {
		this.game.gameLayer.addChild(
			new Blip(
				100,
				this.obj.position, 
				0xffff00, 
				this.game
			)
		)
		this.setForRemoval()
	}

	run() {
		super.run()
		this.changeTint()
	}

	changeTint() {
		let tintSpeed = 0.1
		let s = this.obj.sprite
		let t = s.tint
		let tRgb = {r: t >> 16 & 255, g: t >> 8 & 255, b: t & 255}

		tRgb.g = 255 * Math.abs(Math.sin(s.tintCycle * tintSpeed))

		s.tint = (tRgb.r << 16) + (tRgb.g << 8) + (tRgb.b) 
		s.tintCycle++


	}

	evalPoints(currentPath) {
		return -10
	}




}

exports.Dot = Dot;
exports.Death = Death;