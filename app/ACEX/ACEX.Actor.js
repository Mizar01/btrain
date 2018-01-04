Actor = function() {
	this.alive = true
	this.children = []
	this.obj = null
    this.owner = null
    this.paused = false
    // this.hitAreaObj = null //A separated hitAreaObj (sometimes is useful to have a separated object for this.)
    this.hideOnPause = false

    this.id = ACEX.Utils.generateActorId(this.type) // it can be useful for some improvements
}

Actor.prototype.__run = function() {
    if (this.alive && !this.paused) {
        this.run()
        for (id in this.children) {
            var c = this.children[id]
            if (c.alive) {
                this.children[id].__run()
            }else {
                this.removeChild(id)
            }
        }
    }      
}

Actor.prototype.play = function() {
    this.paused = false
    if (this.hideOnPause) {
        this.show()
    }
}
Actor.prototype.pause = function() {
    this.paused = true
    if (this.hideOnPause) {
        this.hide()
    }
}

Actor.prototype.show = function() {
    this.obj.visible = true
}

Actor.prototype.hide = function() {
    this.obj.visible = false
}

Actor.prototype.addChild = function(a) {
	this.children.push(a)
	a.owner = this
    if (a.obj != null) {
        this.obj.addChild(a.obj)
    }
    return a
}

Actor.prototype.removeChild = function(id) {
	this.children[id].removeSelf()
    this.children[id].owner = null
    this.children.splice(id, 1)
}

Actor.prototype.setForRemoval = function() {
	this.alive = false
}

Actor.prototype.removeSelf = function() {
    if (this.obj !=null && this.owner.obj != null) {
	   this.owner.obj.removeChild(this.obj)  // Call to PIXI.Object.removeChild from the parent pixi object
    }
}

Actor.prototype.initProps = function() {}
Actor.prototype.initObj = function() {}
Actor.prototype.run = function() {}

Actor.prototype.center = function() {
    // TODO : this actually works only for direct children of stage
    // or for chilren of parents positioned in 0,0 and unscaled.
    this.obj.position.set(getAcex().sw/2, getAcex().sh/2)
}

Actor.prototype.followPoint = function(p2, speed, rotate) {
    var mustRotate = rotate || false
    var p1 = this.obj.position
    if (ACEX.Utils.pointDistance(p1, p2) > 3) {
        var angle = ACEX.Utils.angleToPoint(p1, p2)
        this.obj.position.set(
            p1.x + Math.cos(angle) * speed,
            p1.y + Math.sin(angle) * speed
        )
        if (mustRotate) {
            this.obj.rotation = angle
        }
    }
}

Actor.prototype.rotateToPoint = function(p2) {
    this.obj.rotation = ACEX.Utils.angleToPoint(this.obj.position, p2)
}

/**
* Makes the actor move along the current rotation
*/
Actor.prototype.moveForward = function(speed) {
    this.obj.position.x += speed * Math.cos(this.obj.rotation)
    this.obj.position.y += speed * Math.sin(this.obj.rotation)
}

Actor.prototype.addHitAreaObj = function(hitAreaObj, pointer) {
    var o = this.obj
    this.obj.hitArea = hitAreaObj
    o.interactive = true
    if (pointer) {
        o.buttonMode = true
    }
    this.obj._acex_actor = this    
    o.mouseup = o.tap = function(pdata) {
        this._acex_actor.mouseup(pdata)
    }
}

/**
 * Gets the position of the object relative to the originPoint in the world.
 * The originPoint is (0,0) or a different position if you want to find the 
 * relative location (i.e. for a different layer) 
 */
// Actor.prototype.getGlobalPosition = function(originPoint) {
//     originPoint = originPoint || new PIXI.Point()
//     return this.obj.toGlobal(originPoint)
// }
/**
 * E' un wrapper di DisplayObject.toLocal. Se originActor è valorizzato allora l'originPoint può cambiare di conseguenza.
 * Se originActor è nullo di default viene usato un originPoint a 0,0.
 */
Actor.prototype.getRelativePosition = function(originPoint, originActor) { 
    originPoint = originPoint || new PIXI.Point()
    var originObj = null
    if (originActor) {
        originObj = originActor.obj
    }
    var toLocalP = this.obj.toLocal(originPoint, originObj)
    return new PIXI.Point(toLocalP.x * -1, toLocalP.y * -1)
}

/**
 * Note : to have the correct position on the layer, the layer must be direct
 * child of global scene and not rotated
 */
Actor.prototype.getPositionOnLayer = function(layer) {
    var gp = this.obj.toGlobal(new PIXI.Point())
    return new PIXI.Point(gp.x - layer.obj.x, gp.y - layer.obj.y)
}


Actor.prototype.setRectHitArea = function(x, y, w, h, pointer) {
    this.addHitAreaObj(new PIXI.Rectangle(x, y, w, h), pointer)
}
Actor.prototype.setCircleHitArea = function(x, y, r, pointer) {
    this.addHitAreaObj(new PIXI.Circle(x, y, r), pointer)
}

Actor.prototype.setPosition = function(pointObj) {
    this.obj.x = pointObj.x
    this.obj.y = pointObj.y
}




// The main container (it could be assimilated to a ContainerActor in future versions)
StageActor = function(acexRef) {
    Actor.call(this)
    this.obj = acexRef.app.stage
}
StageActor.extends(Actor, "ACEX.StageActor")

//View, Layers are the names usually adopted for this type of container
ContainerActor = function() {
    Actor.call(this)
    this.obj = new PIXI.Container()
    this.logics = []
}
ContainerActor.extends(Actor, "ACEX.ContainerActor")
ContainerActor.prototype.addLogic = function(logic) {
    this.logics.push(logic)
}
ContainerActor.prototype.removeLogic = function(logicId) {
    for (li in this.logics) {
        var l = this.logics[li]
        if (l.id != null && l.id == logicId) {
            this.logics.splice(li, 1)
        }
    }
}
ContainerActor.prototype.run = function() {
    for (li in this.logics) {
        if (this.logics[li].toDelete) {
            this.logics.splice(li, 1)
        }else {
            this.logics[li].run()
        }

    }
}

module.exports = {
    Actor: Actor, 
    ContainerActor: ContainerActor, 
    StageActor: StageActor,
}

