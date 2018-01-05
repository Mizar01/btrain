require('../assets/pixi.js');
require('bootstrap');

import '../css/bs/bootstrap_cyborg.min.css'
import '../css/style.css';

require("./ACEX/ACEX.js");

// require("./GameUtils.js");
require("./GameLevels.js");

require("./Grid.js");
require("./logics.js");

const Grid = require("./Grid").Grid
const TargetCursor = require("./TargetCursor").TargetCursor


// import impactFontUrl from '../resources/impact.fnt';
import optionsPngUrl from '../resources/options.png';


class Game {
	constructor() {
		this.targetCursor = null
		this.setTargetRequested = false

		this.vars = {
			cameraShake: null,
			player: null,
			paths: null
		}

		this.font = "Impact"

		this.currentPopupWindow = ""

		this.gameView
		this.hitAreaLayer
		this.gameLayer // ActorManager
		this.hudLayer
		this.gameMenuView
		//var gameMenuLayer

		this.gameObjects = [] //globally accessible storage for some variable and objects
		this.hudObjects = []  //globally accessible storage for some variables and objects

		this.testObject = null

		this.correct = 0 
		this.wrong = 0

		this.updateScore()

	}

	manageWindowPlayPause(dialogName) {
		if (this.gameView.paused) {
			MenuTools.hide()
			this.gameView.play()
		}else {
			this.gameView.pause()
			MenuTools.show(dialogName)
		}
	}

	updateScore() {
		let text = "Success: " + this.correct + " - Wrong: " + this.wrong
		$("#score").html(text)
	}

	loadLevel(lvlName) {

		if (this.vars.grid != null) {
			this.gameLayer.setForRemoval()
		}

		const pathConfig = buildPath(GameLevels[lvlName])

		const gridCols = pathConfig.length
		const gridRows = pathConfig[0].length

		//Adding a background grid
		this.gameLayer = new ACEX.ContainerActor()
		this.gameLayer.center()

		this.gameView.addChild(this.gameLayer)

		this.vars.grid = new Grid(this, gridCols, gridRows, pathConfig)
		this.gameLayer.addChild(this.vars.grid)

}

}

global.acex = null
global.game = new Game()


$(function() {
	// testPixi()
	init()
})

// function testPixi() {
// 	var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
// 	document.body.appendChild(app.view);

// 	// create a new Sprite from an image path
// 	var bunny = PIXI.Sprite.fromImage(optionsPngUrl)

// 	// center the sprite's anchor point
// 	bunny.anchor.set(0.5);

// 	// move the sprite to the center of the screen
// 	bunny.x = app.renderer.width / 2;
// 	bunny.y = app.renderer.height / 2;

// 	app.stage.addChild(bunny);

// 	// Listen for animate update
// 	app.ticker.add(function(delta) {
// 	    // just for fun, let's rotate mr rabbit a little
// 	    // delta is 1 if running at 100% performance
// 	    // creates frame-independent tranformation
// 	    bunny.rotation += 0.1 * delta;
// 	});
// }

function init() {

	let pixiW = 1000
	let pixiH = 500

	let assets = [
		// {name: 'impactFont', url : impactFontUrl },
		{name: 'optionsPng', url : optionsPngUrl },
	]
	// new ACEX(1002, 702, assets, define_game)
	new ACEX(pixiW, pixiH, assets, define_game)
	// acex.renderer.backgroundColor = 0xffffff

	$('#defaultModalWindow').on('hidden.bs.modal', function () {
		game.manageWindowPlayPause()
	})
}

function define_game() {

	//Basic Structure 
	//	gameView (containerActors and logics)
	//      |----- mapHitAreaLayer (a single actor for a generic and fixed hit area layer)
	//		|----- gameLayer  (actors and logics)
	//		|----- hudLayer   (actors and logics)
	//	inGameMenuView ...
	//      |----- menuLayer 

	// Main game View (composite of game layer plus HUD layer)
	game.gameView = new ACEX.ContainerActor()
	game.hitAreaLayer = new ACEX.ContainerActor()

	game.hitAreaLayer.setRectHitArea(0, 0, acex.sw, acex.sh, false)
	game.hitAreaLayer.mouseup = function(event) {
			if (!game.gameView.paused) {
				game.vars.interactLogic.setTarget(event.data)
			}
			if (game.gameView.paused) {
				// The click will only work outside the popup divs,
				// so this can be used to close those popups in an alternative 
				// and faster way.
				game.manageWindowPlayPause(game.currentPopupWindow)
			}		
	}

	var gv = game.gameView

	//put gameLayer in center position
	game.hudLayer = new ACEX.ContainerActor()
	acex.stageActor.addChild(gv)
	gv.addChild(game.hitAreaLayer)
	gv.addChild(game.hudLayer)

	gv.addLogic(game.vars.interactLogic = new InteractLogic())
	// gv.addLogic(new GenerateLogic(game))
	// gv.addLogic(game.vars.cameraShake = new CameraShakeLogic())
	// gv.addLogic(game.vars.cameraMove = new CameraMoveLogic())
	// gv.addLogic(game.vars.explosionManager = new ExplosionLogic())

	game.loadLevel("lvl_1")


	// Adding dots
	//game.gameLayer.addChild(new Dot(8, 5, "red", game))

	//Adding some random turrets in the map
	// setObjects()

	setupHudLayer()

	game.gameView.play()
	// gameMenuView.pause()

	acex.run()
}



function buildPath(mapLines) {
	let m = []
	for (let y in mapLines) {
		let l = mapLines[y]
		for (let x in l) {
			let c = l[x]
			if (m[x] == undefined) {
				m[x] = []
			}
			m[x][y] = (c != "*") ? c : null
		}
	}
	return m
}

function setupHudLayer() {

	var hudObjects = game.hudObjects
	var hudLayer = game.hudLayer

	// Main bar
	$("body").append("<div id='mainBar'/>")
	// Adding score bar
	$("#mainBar").append("<span class='text-center' id='score'>Loading...</div>")
	game.updateScore()
	for (let l in GameLevels) {
		let onclick = "game.loadLevel(\"" + l + "\");"
		$("#mainBar").append("<button class='btn btn-success pull-right' onclick='" + onclick + "'>" + l + "</button>")
	}



	// hudObjects.optionsIcon = new ACEX.Text("", 0xffcc00, 40, acex.sh - 100, 
	// 	optionsPngUrl, true)
	// hudObjects.optionsIcon.mouseup = function() {
	// 	game.manageWindowPlayPause("gameMenu")
	// }
	// hudLayer.addChild(hudObjects.optionsIcon)


}



function setObjects() {
	var g = game.vars.grid
	var p = game.vars.player
	var gl = game.gameLayer
	// Adding some turrets
	// for (var i = 0; i < 30; i++) {
	// 	var rx = ACEX.Utils.randInt(-g.w / 2, g.w / 2)
	// 	var ry = ACEX.Utils.randInt(-g.h / 2, g.h / 2)
	// 	var lvl = ACEX.Utils.randInt(1, 4)
	// 	gl.addChild(new Turret(lvl, rx, ry))
	// }
}