require("./ACEX/ACEX.js");

const paths = require("./paths")

const Path = paths.Path,
	  Switch = paths.Switch,
	  Generator = paths.Generator,
	  House = paths.House



class Grid extends ACEX.Actor {

	constructor(game, gridX, gridY, pathConfig) {
		
		super()
		this.w = getAcex().sw - 1
		this.h = getAcex().sh - 1
		this.res = Math.min ((this.w - 1) / gridX, (this.h - 1) / gridY)
		this.obj = new PIXI.Graphics()
		this.redraw()

		this.paths = []
		this.game = game

		this.availColors = ""

		this.setup(pathConfig)
	}

	setup(pathConfig) {
		//Adding map of paths and switches
		for (let x=0; x < pathConfig.length; x++) {
			for(let y = 0; y < pathConfig[0].length; y++) {
				this.addPathObject(x, y, pathConfig[x][y])
			}
		}
		for (let x=0; x < this.paths.length; x++) {
			for(let y = 0; y < this.paths[0].length; y++) {
				if (this.paths[x][y] != null) {
					this.paths[x][y].setup()
				}
			}
		}
		
	}

	addPathObject(x, y, pathCode) {

		if (this.paths[x] == undefined) {
			this.paths[x] = []
		}
		if (pathCode == null) {
			this.paths[x][y] = null
		} else {

			let c = pathCode

			if (c == 'x') {
				this.paths[x][y] = new Switch(x, y, c, this)
			} else if (c == 'g') {
				this.paths[x][y] = new Generator(x, y, c, this)
			} else if ( "RGBP".indexOf(c) != - 1) {
				if (this.availColors.indexOf(c) == -1) {
					this.availColors += c
				}
				this.paths[x][y] = new House(x, y, c, this)
			} else {
				this.paths[x][y] = new Path(x, y, c, this)
			}
			game.gameLayer.addChild(this.paths[x][y])
		}
	}

	redraw() {
		var o = this.obj
		var wspan = this.w/2
		var hspan = this.h/2
		o.alpha = 0.1
		o.lineStyle(1, 0xAAAAAA);
		//v lines
		for (var x = -wspan; x <= wspan; x+= this.res) {
			o.moveTo(x,-hspan)
			o.lineTo(x, hspan)
		}
		// h lines
		for (var y = -hspan; y <= hspan; y+= this.res) {
			o.moveTo(-wspan, y)
			o.lineTo(wspan, y)
		}
	}

	getPath(x, y) {
		if (x >= 0 && x < this.paths.length && 
			y >= 0 && y < this.paths[0].length) {
			return this.paths[x][y]
		}else {
			return null
		}
	}

	getNext(path) {
		let d = ACEX.Utils.dirCoord(path.direction)
		let np = {x: path.logicPosition.x + d[0], y: path.logicPosition.y + d[1]}
		return this.getPath(np.x, np.y)
	}

	gridToCell(mpos) {

		return {
			x: Math.floor((mpos.x + this.w/2)/this.res),
			y: Math.floor((mpos.y + this.h/2)/this.res),
		}

	}

	cellToGrid(cpos, centered) {
		centered = centered || false
		let offset = centered ? this.res / 2 : 0 
		return {
			x: cpos.x * this.res - this.w/2 + offset,
			y: cpos.y * this.res - this.h/2 + offset,
		}

	}

	touch(mousePos) {
		let gridPos = this.gridToCell(mousePos)
		if (gridPos.x >= 0 && gridPos.x <= this.paths.length &&
			gridPos.y >= 0 && gridPos.y <= this.paths[0].length) {
			let p = this.paths[gridPos.x][gridPos.y]
			if (p != null) {
				p.toggle()
			}
		}
	}
}

exports.Grid = Grid