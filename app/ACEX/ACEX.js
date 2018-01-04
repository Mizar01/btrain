/**
* Add a method to any function to speed up code generation when inheriting.
*/
Function.prototype.extends = function(baseClass, typeName) {
    this.prototype = Object.create(baseClass.prototype)
    this.prototype.constructor = this

    //The superClass must be used in a static way
    // example: XXX.Object.superClass.method.call(instance,params)  
    // DON'T USE superClass with 'this' identifier.
    // ---->   Use this.getSuperClass instead !!!!! <-----
    this.superClass = baseClass.prototype //(USE WITH CAUTION : VERY DANGEROUS, use this.getSuperClass())

    this.prototype.type = typeName

    this.prototype.getSuperClass = function() {
        return eval(this.type + ".superClass")
    }

}

var THREE = require("./THREE.Clock.js");
var ACEXTimers = require("./ACEX.TimeManager.js");
require("./ACEX.Logic.js");
var ACEXUtils = require("./ACEX.Utils.js")
var ACEXActors = require("./ACEX.Actor.js")
var ACEXText = require("./ACEX.Text.js")
var ACEXBar = require("./ACEX.Bar.js")
var ACEXRadiusBar = require("./ACEX.RadiusBar.js")
    
var __acex_standard_name = "acex"
getAcex = function() {
    return window[__acex_standard_name]
}

ACEX = function(w, h, assets, callback) {
    window[__acex_standard_name] = this
    this.sw = w
    this.sh = h
    this.time = new ACEX.TimeManager() //Global time of the game.
    this.app = null
    this.renderer = null
    this.canvasContainerId = "canvas_container"
    this.canvasAlign = "center"
    this.canvasInit()
    this.stageActor = new ACEX.StageActor(this)
    this.loadAssets(assets, callback)
    //this.stageActor.obj.mouseup = function(){getAcex().events["mouseup"] = true}
    this.events = []

    // Variable useful to store global objects
    this.env = null
}

ACEX.prototype.canvasInit = function() {
    // this.renderer = PIXI.autoDetectRenderer(this.sw, this.sh)
    this.app = new PIXI.Application(this.sw, this.sh);
    this.renderer = this.app.renderer
    var cc = document.createElement("div")
    cc.id = this.canvasContainerId
    cc.align = this.canvasAlign
    document.body.appendChild(cc)
    document.getElementById(cc.id).appendChild(this.app.view) 
}

ACEX.prototype.loadAssets = function(assets, callback) {
    var loader = PIXI.loader
    loader.add(assets)
    loader.onComplete.add( () => {
        callback()
    })
    loader.load()
}

ACEX.prototype.run = function() {
    this.time.run()
    this.stageActor.__run()
    this.app.render(this.stageActor.obj)
    this.resetEvents()
    let self = this
    requestAnimationFrame(function() {self.run()})
}

ACEX.prototype.resetEvents = function() {
    this.events = []
}

ACEX.prototype.getEvent = function(event) {
    if (this.events[event] == null) {
        return false
    }else {
        return true
    }
}

/**
* Get the mouse position in relative coords given the actor.
* If the actor is not given, the stageActor will be considered (real mouse position)
* If the positionData object is not null, this is used to define the position instead of
* the current mouse position
*/
ACEX.prototype.getMousePoint = function(relActor, positionData) {
    var mp = null
    // console.log (positionData)
    // console.log(relActor)
    if (positionData != null) {
        mp = positionData.global
    }else {
        mp = this.renderer.plugins.interaction.mouse.global
    }
    // console.log(mp)
    if (relActor) {
        return new PIXI.Point(mp.x - relActor.obj.x, mp.y - relActor.obj.y)
    }else {
        return mp
    }
}

ACEX.Utils = ACEXUtils.Utils
ACEX.HtmlUtils = ACEXUtils.HtmlUtils
ACEX.Actor = ACEXActors.Actor
ACEX.ContainerActor = ACEXActors.ContainerActor
ACEX.StageActor = ACEXActors.StageActor
ACEX.TimeManager = ACEXTimers.TimeManager
ACEX.CooldownTimer = ACEXTimers.CooldownTimer
ACEX.Logic = Logic
ACEX.Text = ACEXText.Text
ACEX.Bar = ACEXBar.Bar
ACEX.RadiusBar = ACEXRadiusBar.RadiusBar
// export { getAcex, ACEX, THREE }

module.exports = {
    ACEX: ACEX,
    THREE: THREE,
}

