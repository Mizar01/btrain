/**
* This is a wrapper for the Clock and it stores the elapsed time between frames.
* Actually it can't be used as a contextual timer (so the time is always going on for
* every Actor/Manager, even if they are paused) - Use the ACE3.CooldownTimer instead
*/

TimeManager = function() {
	this.clock = new THREE.Clock()  // the THREE clock object for custom uses.
	this.frameTime = this.clock.getElapsedTime() // the time when the current frame is executed
	this.frameDelta = this.clock.getElapsedTime() // the time passed from the previous frame.
}

/**
* This method should be called by ace3 core engine once per frame, so 
* the frameDelta stores exactly the time passed between frames.
*/
TimeManager.prototype.run = function() {
	this.frameDelta = this.clock.getDelta()
	this.frameTime = this.clock.getElapsedTime()
}



/**
* The CooldownTimer is used as local timer for an Actor/Entity. 
* It must be called everytime it's needed through trigger() method.
* The method returns if the time has reached 0 and it can restart
* automatically if needed (default is restart = false) 
*/

CooldownTimer = function(cooldownTime, autoRestart) {
    this.maxTime = cooldownTime
    this.time = cooldownTime
    this.autoRestart = autoRestart || false
    this.stopped = false
}

/* 
* If the timer is stopped the trigger is always true.
*/
CooldownTimer.prototype.trigger = function() {
    if (this.stopped) {
        return true
    }
    this.time -= getAcex().time.frameDelta
    if (this.time <= 0) {
        if (this.autoRestart) {
            // TRIGGER AND RESET COOLDOWN
            this.time = this.maxTime
        }else {
            this.stopped = true
        }
        return true
    }else {
        return false
    }
}

CooldownTimer.prototype.restart = function(newTime, autoRestart) {
    this.maxTime = newTime || this.maxTime
    this.time = newTime || this.maxTime
    this.autoRestart = autoRestart || this.autoRestart
    this.stopped = false
}

module.exports = {
    TimeManager: TimeManager,
    CooldownTimer: CooldownTimer,
}