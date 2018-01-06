const Dot = require("./Dot").Dot
const TargetCursor = require("./TargetCursor").TargetCursor

InteractLogic = function() {
	ACEX.Logic.call(this)
}
InteractLogic.extends(ACEX.Logic, "InteractLogic")

InteractLogic.prototype.run = function() {}

InteractLogic.prototype.setTarget = function(posdata) {
	// if (game.targetCursor != null) {
	// 	game.targetCursor.setForRemoval()
	// 	game.targetCursor = null
	// }
	let mp = acex.getMousePoint(game.gameLayer, posdata)
	// game.targetCursor = new TargetCursor(mp)
	// game.gameLayer.addChild(game.targetCursor)

	game.vars.grid.touch(mp)
}
