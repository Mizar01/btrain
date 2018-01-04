require("./ACEX/ACEX.js");

const Signal = require("./signals").Signal

class Dot extends ACEX.Actor {
	
	constructor(x, y, colorCode, game) {
		super()
		this.game = game
		this.obj = null
		this.colorCode = colorCode
		this.draw(this.colorCode)
		this.logicPosition = {x: x, y: y}
		this.setPosition(this.game.vars.grid.cellToGrid(this.logicPosition, true))
	
		this.nextMoveTimer = new ACEX.CooldownTimer(0.75, true)	

		this.speed = 0.5
		//this.speed = 10
		this.moveTimer = new ACEX.CooldownTimer(1/this.speed, true)

		this.stop = false

	}

	draw(colorCode) {

		let colorMap = { R: "red", G: "green", B: "blue", P: "purple"  }
		let grid = this.game.vars.grid
		var o = new PIXI.Graphics()

		o.beginFill(ACEX.Utils.getHexColor(colorMap[colorCode]))

		let r = grid.res
		let size = 	20
		o.drawRect(-size/2, -size/2, size, size)
		o.endFill()
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

		let tp = this.targetPosition
		if (tp == null) {
			this.setNewTarget()
			return
		}

		if (ACEX.Utils.pointDistance(this.obj.position, tp) < 8 ) {
			//this.setPosition(tp)
			this.setNewTarget()
		} 
			
		let angle = ACEX.Utils.angleToPoint(this.obj.position, tp)
		this.followPoint(this.targetPosition, this.speed, false)

	}

	setNewTarget() {

		let lp = this.logicPosition
		let grid = this.game.vars.grid
		let currentPath = grid.paths[lp.x][lp.y]

		if (currentPath.constructor.name == "House") {
			if (currentPath.code == this.colorCode) {
				this.setScore(1, currentPath)
			} else {
				this.setScore(-1, currentPath)
			}
			this.stop = true
			this.setForRemoval()
			return
		}
 
		let dir = currentPath.getDirection()
		let np = {x: lp.x + dir[0], y: lp.y + dir[1]}
		this.logicPosition = np
		this.targetPosition = this.game.vars.grid.cellToGrid(np, true)

	}

	setScore(points, currentPath) {
		let ok = (points >= 0) ? true : false
		if (points >= 0) {
			this.game.correct++
		} else {
			this.game.wrong++
		}
		this.game.updateScore()
		this.game.gameLayer.addChild(
			new Signal(
				100,
				currentPath.getCenteredPosition(), 
				ok, 
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

exports.Dot = Dot;