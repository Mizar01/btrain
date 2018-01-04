require("./ACEX/ACEX.js");

// Used to hilight arrows in the Paths objects 
// This should be a logic not a real actor
class Trail extends ACEX.Actor {
	
	constructor(x, y, game) {
		super()
		console.log(this.obj)
		this.game = game
		this.nextMoveTimer = new ACEX.CooldownTimer(0.25, true)
		this.initialPosition = {x: x, y: y}
		this.logicPosition = this.initialPosition
	}

	run() {

		let lp = this.logicPosition
		let grid = this.game.vars.grid
		let currentPath = grid.paths[lp.x][lp.y]
		if (currentPath.constructor.name == "House") {
			this.logicPosition = this.initialPosition;
			return
		}

		if (this.nextMoveTimer.trigger()) {
			this.setNextHilight(currentPath)
		}
	}

	setNextHilight(currentPath) {
		// de-hilight
		// if (currentPath.obj.arrow != null) {
		// 	let a = currentPath.obj.arrow
		// 	a.tint = currentPath.arrowTint
		// }

		
		currentPath = currentPath.getNext()
		if (currentPath != null) {
			this.logicPosition = currentPath.logicPosition
			currentPath.startHilight()
		}
		// if (currentPath != null && currentPath.obj.arrow != null) {
		// 	let a = currentPath.obj.arrow
		// 	a.tint = currentPath.arrowHLTint
		// }
	}

}

exports.Trail = Trail;