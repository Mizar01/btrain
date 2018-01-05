Utils = {
	randInt: function(min, max) {
		var rnd = min + Math.random() * (max - min)
		return Math.round(rnd)
	},
	randFloat: function(min, max) {
		return min + Math.random() * (max - min)
	},
	getRandomColor: function() {
    	v = Math.floor(Math.random() * 16777216)
    	return v
	},
	pointDistance: function(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
	},
	actorDistance: function(a1, a2) {
		return Utils.pointDistance(a1.obj.toGlobal(new PIXI.Point()), a2.obj.toGlobal(new PIXI.Point()))
	},
	angleToPoint: function(p1, p2) {
		return Math.atan2((p2.y - p1.y),(p2.x - p1.x))
	},
	angleToActor: function(a1, a2) {
		// return ACEX.Utils.angleToPoint(a1.getRelativePosition(), a2.getRelativePosition())
		return Utils.angleToPoint(a1.obj.toGlobal(new PIXI.Point()), a2.obj.toGlobal(new PIXI.Point()))
	},
	/**
	*	Returns a float number with a maximum of decimals limited by precision.
	*   For example n = 2.345533 and precision = 2 will return: 2.35
	*/
	roundFloat: function(n, precision) {
		var p = Math.pow(10, precision)
		return Math.round(n * p) / p
	},
	chance: function(perc) {
		return Utils.randInt(0, 100) < perc
	},
	/**
	 * Return the value or the nearest boundary given by min,max if 
	 * the value goes beyond these bounds.
	 */
	bound: function(value, min, max) {
		if (value > max) {
			return max
		}else if (value < min) {
			return min
		}else {
			return value
		}
	},
	generateActorId: function(type) {
		type = type || "Actor"
		return type + Utils.randInt(100000, 999999) + Utils.randInt(100000, 999999)
	},
	capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	},
	// returns a random item from a list
	randomItem: function(list) {
		return list[Utils.randInt(0, list.length - 1)]
	},
	// colorBitmapText: function(btext, color) {
	// 	for (ci in btext.children) {
	// 		btext.children[ci].tint = color
	// 	}
	// },

	getHexColor: function(colorCode) {

		let c = colorCode.toLowerCase()

		let isIn = (code, arr) => arr.findIndex( v => v == code ) != -1

		if (isIn(c, ["red", "r"] )) return 0xff0000;
		if (isIn(c, ["green", "g"] )) return 0x00ff00;
		if (isIn(c, ["blue", "b"] )) return 0x0000ff;
		if (isIn(c, ["purple", "p"] )) return 0xff00ff;

	},

	dirCoord: function (direction) {

		if (direction == "t" || direction == "top") {
			return [0, -1]
		}
		if (direction == "r" || direction == "right") {
			return [1, 0]
		}
		if (direction == "b" || direction == "bottom") {
			return [0, 1]
		}
		if (direction == "l" || direction == "left") {
			return [-1, 0]
		}

	},
}

HtmlUtils = {
	getInput: function(iName) {
		return $("input[name='" + iName + "'").val()
	},
	setInput: function(iName, value) {
		$("input[name='" + iName + "'").val(value)	
	},
}

// export { HtmlUtils as ACEXHtmlUtils, Utils  as ACEXUtils}

exports.Utils = Utils
exports.HtmlUtils = HtmlUtils
