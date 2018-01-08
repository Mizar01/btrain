require("./ACEX/ACEX.js");
const Dot = require("./Dot").Dot
const Death = require("./Dot").Death
const Trail = require("./Trail").Trail
const Blip = require("./signals").Blip

class Path extends ACEX.Actor {
	
	constructor(x, y, code, grid) {
		super()
		this.grid = grid
		this.obj = null
		this.logicPosition = {x: x, y: y}
		this.code = code
		this.direction = this.code
		this.baseColor = 0x111111
		// this.baseColor = 0x999999
		this.arrowTint = 0x444444
		this.hlIteration = null
		// this.arrowHLTint = this.arrowTint

		this.markColor = 0xffff00
		this.hlSpeed = 0.1

		this.redraw()
		this.setPosition(grid.cellToGrid(this.logicPosition))
	}

	redraw() {
		let r = this.grid.res
		let o = new PIXI.Graphics()

		let sq = new PIXI.Graphics() 
		sq.position = new PIXI.Point(r/2, r/2)
		sq.alpha = 0.05
		sq.beginFill(this.baseColor)
		sq.drawRect(-r/2, -r/2, r, r)
		sq.endFill()
		o.addChild(sq)
		o.square = sq

		this.obj = o
	}

	_drawPath() {

		// The path must be a direct gameLayer child (above all other path drawings)
		let r = this.grid.res
		let circleSize = r/15
		let thick = 5

		let a = this.obj.arrow
		if(a != null) {
			a.clear()
		}else {
			a = new PIXI.Graphics()
			a.position = new PIXI.Point(r/2, r/2)
			//this.grid.game.gameLayer.obj.addChild(a)  // direct object child of gameLayer
			this.obj.addChild(a)
			this.obj.arrow = a
		}

		let p = this.getCenteredPosition()

		a.lineStyle(thick, 0xffffff, 1)
		
		let nPath = this.getNext()
		let np = nPath.getCenteredPosition()

		let ang = ACEX.Utils.angleToPoint(p, np)
		let startLinePoint = ACEX.Utils.polarToCart(circleSize, ang)
		let endLinePoint = ACEX.Utils.polarToCart(r - circleSize, ang)
		if (nPath.isHouse) {
			// draw the same line but stops at half length
			endLinePoint = ACEX.Utils.polarToCart(r/2, ang)
		}
		a.moveTo(startLinePoint.x , startLinePoint.y)
		a.lineTo(endLinePoint.x, endLinePoint.y)	
		
		a.beginFill(0xffffff)
		a.drawCircle(0, 0, circleSize)
		a.endFill()
	}

	// _rotateArrow() {
	// 	this.obj.arrow.rotation = Math.PI / 2 * "rblt".indexOf(this.direction)
	// }

	// rotateSwitch() {
	// 	console.log(this)
	// 	if (this.direction == 't' || this.direction == 'b') {
	// 		this.obj.children[0].rotation = Math.PI / 2
	// 	} else {
	// 		this.obj.children[0].rotation = 0
	// 	}
	// }

	// This must be called after every path has been initialized
	setup() {
		this._drawPath()
	}

	toggle() {}

	getDirection() {
		return ACEX.Utils.dirCoord(this.direction)
	}

	mark() {
		this.obj.square.alpha = 0.0
		this.obj.square.graphicsData[0].fillColor = this.markColor
	}

	unmark() {
		this.obj.square.alpha = 0.1
		this.obj.square.graphicsData[0].fillColor = this.baseColor
	}

	getNext() {
		return this.grid.getNext(this)
	}

	getNextPathCenteredPosition() {
		let np = this.getNext()
		if (np != null) {
			return np.getCenteredPosition()
		}
	}

	startHilight() {
		this.hlIteration = 0 // 0 - 10
	}

	getCenteredPosition() {
		return { 
			x: this.obj.position.x + this.grid.res / 2, 
			y: this.obj.position.y + this.grid.res / 2, 
		}
	}

	hlManage() {
		if (this.hlIteration != null && this.hlIteration < 10) {
			if (this.obj.arrow) {

				let t = this.arrowTint
				let maxTint = 180
				var span = maxTint - (t >> 16 & 255)
				let tRgb = {r: t >> 16 & 255, g: t >> 8 & 255, b: t & 255}
				let nc = tRgb.r + span * Math.sin(Math.PI * (this.hlIteration/10))
				this.obj.arrow.tint = (nc << 16)  + (nc << 8) + nc
				// if (this.logicPosition.x == 1 && this.logicPosition.y == 2) console.log(Math.cbrt(this.obj.arrow.tint))
				this.hlIteration += this.hlSpeed
			}


		} else {
			this.hlIteration = null // null to stop 
			if (this.obj.arrow) {
				this.obj.arrow.tint = this.arrowTint
			}
		}
	}

	run() {
		this.hlManage()
	}


}


class Generator extends Path {
	constructor(x, y, code, grid) {
		super(x, y, code, grid)
		this.genTimer = new ACEX.CooldownTimer(10, true)
		// Adding initial random time(without initial cooldown)
		this.genTimer.time = ACEX.Utils.randInt(0, 2)

		this.blipTimer = new ACEX.CooldownTimer(2, true)
	}

	setup() {
		let g = this.grid
		let p = this.logicPosition
		if (g.getPath(p.x, p.y - 1) != null) {
			this.direction = "t"
		}
		if (g.getPath(p.x, p.y + 1) != null) {
			this.direction = "b"
		}
		if (g.getPath(p.x - 1, p.y) != null) {
			this.direction = "l"
		}
		if (g.getPath(p.x + 1, p.y) != null) {
			this.direction = "r"
		}
		this.grid.game.gameLayer.addChild(new Trail(p.x, p.y, this.grid.game))

	}

	redraw() {
		let r = this.grid.res
		let o = new PIXI.Graphics()
		let margin = - r / 4

		let sq = new PIXI.Graphics() 
		sq.position = new PIXI.Point(r/2, r/2)
		sq.beginFill(0x440044)
		sq.drawRect(-r/2 - margin, -r/2 - margin, r + margin * 2, r + margin * 2)
		sq.endFill()
		o.addChild(sq)

		this.obj = o
	}

	run() {
		if (this.genTimer.trigger()) {
			let grid = this.grid
			let colors = grid.availColors
			let colorCode = colors[ACEX.Utils.randInt(0, colors.length - 1)]


			//1 every N is a death obj
			let prob = 50  // perc.%
			let objType = (ACEX.Utils.randInt(0, 99) < prob) ? Death : Dot

			this.grid.game.gameLayer.addChild(
				new objType(
					this.logicPosition.x, 
					this.logicPosition.y, 
					colorCode, 
					this.grid.game
				)
			)
			this.generateBlip(50, ACEX.Utils.getHexColor(colorCode))
		}

		if (this.blipTimer.trigger()) {
			this.generateBlip(30, 0xAAAAAA)
		}

		this.obj.children[0].rotation = Date.now() * 0.001
	}

	generateBlip(radius, color) {
		this.grid.game.gameLayer.addChild(
			new Blip(
				radius,
				this.getCenteredPosition(), 
				color, 
				this.game
			)
		)
	}


}

class House extends Path {

	constructor(x, y, pathCode, grid) {
		super(x, y, pathCode, grid)
		this.isHouse = true   // allow to avoid constructor.name (it conflicts with uglifyJs)
	}


	redraw() {
		
		let colorMap = { R: "red", G: "green", B: "blue", P: "purple"  }

		let r = this.grid.res
		let o = new PIXI.Graphics()
		let margin = - 1

		let sq = new PIXI.Graphics() 
		sq.position = new PIXI.Point(r/2, r/2)
		let lineColor = ACEX.Utils.getHexColor(colorMap[this.code])
		sq.lineStyle(3, lineColor, 1)
		sq.drawRect(-r/2 - margin, -r/2 - margin, r + margin * 2, r + margin * 2)
		o.addChild(sq)

		this.obj = o
	}

	setup() {}



}



class Switch extends Path {

	constructor(x, y, pathCode, grid) {
		super(x, y, pathCode, grid)
		this.dirIndex = 0
		this.to = []
		this.from = null
		this.arrowTint = 0xaaaaaa

	}

	redraw() {
		let r = this.grid.res
		let o = new PIXI.Graphics()
		let margin = -1

		let sq = new PIXI.Graphics() 
		sq.position = new PIXI.Point(r/2, r/2)
		sq.beginFill(0xfff0ff)
		// sq.drawRect(-r/2 - margin, -r/2 - margin, r + margin * 2, r + margin * 2)
		sq.drawCircle(0, 0, r/4 - 2)
		sq.endFill()
		o.addChild(sq)
		o.square = sq
		this.obj = o
	}

	setup() {

		let c = this.code
		let ways = this._detectWays()
		this.from = ways.from
		this.to = ways.to 
		this.dirIndex = 0
		this.direction = this.to[0].direction
		this.from.mark()
		// this.mark()
		this.to[this.dirIndex].path.mark()

		this._drawPath()

	}

	run() {
		this.hlManage()
		// let scale = 1 + 0.1 * Math.sin(Date.now() * 0.01)
		// //console.log(scale)
		// this.obj.square.scale = new PIXI.Point(scale,scale)
	}

	toggle() {
		this.to[this.dirIndex].path.unmark()
		let d = this.direction
		this.dirIndex = (this.dirIndex + 1) % this.to.length
		this.direction = this.to[this.dirIndex].direction
		this.to[this.dirIndex].path.mark()
		// this._rotateArrow()
		this._drawPath()
	}

	_detectWays() {
		// up
		let from = null
		let to = []
		let coords = [ 
			{dir: 't', c: {x: 0 , y:-1} }, 
			{dir: 'r', c: {x: 1 , y: 0} }, 
			{dir: 'b', c: {x: 0 , y: 1} }, 
			{dir: 'l', c: {x:-1 , y: 0} }, 
		]
		for (let i in coords) {
			let d = coords[i].dir
			let c = coords[i].c 
			let nc = { x: this.logicPosition.x + c.x, y: this.logicPosition.y + c.y}
			let path = this.grid.getPath(nc.x, nc.y)
			if (path != null) {
				// conditions for from
				if (
					(d == 't' && path.direction == 'b') ||
					(d == 'b' && path.direction == 't') ||
					(d == 'l' && path.direction == 'r') ||
					(d == 'r' && path.direction == 'l')
				) {
					from = path
				} else if (d == path.direction)  {
					to.push({
						direction: d,
						path: path
					})
				}
			}
		}
		return { from: from, to: to }
	}
}

exports.Path = Path;
exports.Switch = Switch;
exports.Generator = Generator;
exports.House = House;