/////////////////////////////////////////////////////////////////////////////



//                         Zombie Object class                              //


/////////////////////////////////////////////////////////////////////////////

//The Zombie objects 
Zombie = function (game, x) {

    //invokes creation of sprite object
    Phaser.Sprite.call(this, game, x + 400, 50, 'zombie', 'z1.png');
    //zombie physics engine set
    game.physics.enable(this, Phaser.Physics.ARCADE);
    //zombie gravity set to simulate falls
    this.body.gravity.y = 500;
    //animates the zombie 
    this.animations.add('attack', Phaser.Animation.generateFrameNames('z1', 'z7'), 3.5, true, false);
    //starts zombie animation
    this.animations.play('attack');

};


//Zomnie prototype inherits from Phaser.Sprite.prototype
Zombie.prototype = Object.create(Phaser.Sprite.prototype);
//the constructor is the Zombie function above
Zombie.prototype.constructor = Zombie;

//update method for this class, moves the object to the left ever iteration of this loop
//as long is the object excists
Zombie.prototype.update = function () {

    //if the zombie is no longer is in to world kill it 
    if (this.y >= this.game.world.height) {
        this.destroy();
        //otherwise keep moving to in the x pos
    } else {
        this.body.velocity.x -= 1;
    }

    //zombies arent smart so they dont follow player and fall of edges
}