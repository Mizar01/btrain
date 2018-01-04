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


GenerateLogic = function(game) {
	ACEX.Logic.call(this)
	this.game = game
	this.genTimer = new ACEX.CooldownTimer(5, true)
}
GenerateLogic.extends(ACEX.Logic, "GenerateLogic")

GenerateLogic.prototype.run = function() {
	if (this.genTimer.trigger()) {
		this.game.gameLayer.addChild(new Dot(8, 5, "red", this.game))
	}
}

GenerateLogic.prototype.setTarget = function(posdata) {
	if (game.targetCursor != null) {
		game.targetCursor.setForRemoval()
		game.targetCursor = null
	}
	let mp = acex.getMousePoint(game.gameLayer, posdata)
	game.targetCursor = new TargetCursor(mp)
	game.gameLayer.addChild(game.targetCursor)

	game.vars.grid.touch(mp)
}



CameraShakeLogic = function() {
	ACEX.Logic.call(this)
	this.refresh = false
	this.maxShakeRadius = 5
	this.shakeRadius = 0
}
CameraShakeLogic.extends(ACEX.Logic, "CameraShakeLogic")

CameraShakeLogic.prototype.run = function() {
	if (this.refresh) {
		this.rest()
	    this.shakeRadius = this.maxShakeRadius
	    this.refresh = false
	}
	if (this.shakeRadius > 0) {
		var m = this.shakeRadius % 2
		var dir = -1 
		if (m == 0) {
			dir = 1
		}
		this.shakeRadius--
		game.gameLayer.obj.position.x  += this.shakeRadius * dir
		//repositioning only once if necessary
		if (this.shakeRadius <= 0) {
			this.rest()
		}
	}
}

CameraShakeLogic.prototype.rest = function() {
	game.gameLayer.obj.position = game.vars.cameraMove.worldPosition.clone()
}

/**
* The camera will be moving the entire game.gameLayer whenever the player is 
* trespassing the thresholdbounds.
* The speed of movement is determined by the speed of the player going out 
* of these bounds.
*/
CameraMoveLogic = function() {
	ACEX.Logic.call(this)
	this.refresh = false
	this.absoluteCenter = new PIXI.Point(acex.sw/2, acex.sh/2)
	game.testObject = game.gameLayer
	let glObj = game.gameLayer.obj
	this.worldPosition = new PIXI.Point(glObj.x, glObj.y) 
	this.boxSpan = new PIXI.Point(160, 120) //the thresholds of width and height
	this.speed = 0.02
	// this.drawTestBoundingBox()
}
CameraMoveLogic.extends(ACEX.Logic, "CameraMoveLogic")

CameraMoveLogic.prototype.run = function() {
	var diff = this.playerDiffs()
	//console.log(diff)
	if (Math.abs(diff.x) + Math.abs(diff.y) > this.speed * 4) {
		this.worldPosition.x -= diff.x * this.speed
		this.worldPosition.y -= diff.y * this.speed
		game.gameLayer.setPosition({
			x: this.worldPosition.x,
			y: this.worldPosition.y
		})
	}
}

/**
* playerDiffs evaluates how far the player is going out of 
* the threshold box. If it's inside the box the diff is zero.
*/
CameraMoveLogic.prototype.playerDiffs = function() {
	var pp = game.vars.player.obj.position
	var b = this.boxSpan
	var c = this.worldPosition
	var absC = this.absoluteCenter
	var rx = pp.x + c.x - absC.x //in few words : relative to the center of the screen
	var ry = pp.y + c.y - absC.y
	// calculate x diff
	var xdiff = 0
	if (rx < -b.x) {
		xdiff = rx + b.x 
	}else if (rx > b.x) {
		xdiff = rx - b.x
	}
	var ydiff = 0
	if (ry < - b.y) {
		ydiff = ry + b.y 
	}else if (ry > b.y) {
		ydiff = ry - b.y
	}
	//console.log(xdiff, ydiff)
	return new PIXI.Point(xdiff, ydiff)
}

CameraMoveLogic.prototype.reset = function() {
	game.gameLayer.obj.position.set(0, 0)
}

CameraMoveLogic.prototype.drawTestBoundingBox = function() {
	var b = this.boxSpan
	var o = new PIXI.Graphics()
	o.lineStyle(2, 0xffff00)
	o.alpha = 0.2
	o.drawRect(-b.x, -b.y, b.x * 2, b.y * 2)
	o.position.set(acex.sw/2, acex.sh/2)
	acex.stageActor.obj.addChild(o)
}

ExplosionLogic = function() {
	ACEX.Logic.call(this)
	this.explosionArray = []
	this.maxExplosions = 10 //max explosion per time
}

ExplosionLogic.extends(ACEX.Logic, "ExplosionLogics")

ExplosionLogic.prototype.run = function() {
	// TODO : manage the explosion array
	// For little size of the array it can remain with dead explosion that
	// will be pushed away by new explosions sooner or later.
}

ExplosionLogic.prototype.add = function(actor) {

	//console.log("actor pos: " + actor.obj.position.x + " / " + actor.obj.position.y + 
	//	" ---- > onScreen : " + GameUtils.actorIsOnScreen(actor))

	if (GameUtils.actorIsOnScreen(actor)) {
		if (this.explosionArray.length >= this.maxExplosions) {
			var e = this.explosionArray.shift()
			if (e != null) {
				e.setForRemoval()
			}
		}
		var e = new Explosion(25, actor.obj.position)
		game.gameLayer.addChild(e)
		this.explosionArray.push(e)
	}

}