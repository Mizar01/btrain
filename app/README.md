

Possible names for the game

Impulse


TODO (* : done) : 

* Diamond spawning : sometimes the players keep shooting at the dead enemy for a while, causing him to possibly spawn other diamonds. This should 
  be prevented in the control of the enemy health.

* Add xp to player should cause him leveling up more than once (if the xp is so much). But currently this is not implemented and the level is only
  incremented by one.

* After the new Implementation of getRelativePosition the distance calculation on bullet collision is not well calculated
* I can't make the overboss rotate, when it rotates its turrets don't shoot anymore.
* Sometimes a Bug object generates a bad transform (but I changed code, so maybe it will not happen again)
* now when I click to close the speechText the player goes there. This doesn't happen (and it is right) when I'm opening the speechText
  NOTE : this is happening when the BText child of the speechText has the property clickable = true


- Improve the hitArea for BText when it is based on textObj. Apparently I can't use textObj.textWidth because it's wrong before the assignment to the scene.

