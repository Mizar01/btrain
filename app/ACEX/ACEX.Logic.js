Logic = function() {
	this.toDelete = false
}
Logic.prototype.run = function() {}
Logic.prototype.setForRemoval = function() {
	this.toDelete = true
}

exports.Logic = Logic