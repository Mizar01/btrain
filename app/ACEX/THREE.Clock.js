THREE = function() {}  // This is used so I can load some useful THREE.js methods

/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.Clock = function ( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.usePerformance = false

	this.running = false;

};

THREE.Clock.prototype = {

	constructor: THREE.Clock,

	start: function () {
		let p = self.performance
		this.startTime = p !== undefined && p.now !== undefined && this.usePerformance
					 ? p.now()
					 : Date.now();

		this.oldTime = this.startTime;
		this.running = true;
	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getDelta: function () {

		var diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {
			let p = self.performance
			let newTime = p !== undefined && p.now !== undefined && this.usePerformance
					 ? p.now()
					 : Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

};

exports.THREE = THREE