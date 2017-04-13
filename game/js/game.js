//game array, created if not already created 
var thrillerGame = thrillerGame || {};

//timer varibles
var timer;
var mins;
var sec;
var count;
var started = false;

//adds the Game to the game array
thrillerGame.Game = function () {};


thrillerGame.Game.prototype = {

    //everything has already been preloaded
    preload: function () {

        //the loading bar image is loaded in the boot menu befor this page
        //loading screen
        var loading = this.add.sprite(300, 300, "loading");
        loading.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(loading);

    },

    /////////////////////////////////////////////////////////////////////////////



    //                     Game and its objects creted here                     //


    /////////////////////////////////////////////////////////////////////////////

    //this is where everything is orginally created 
    create: function () {

        started = false;
        // Create a custom timer
        timer = this.time.create();
        //sets the timer to count down from 3 minutes
        timerEvent = timer.add(Phaser.Timer.MINUTE * 3, timer.stop(), this);
        // console.log(timer);

        //adds the ingame background music 
        this.thrillerMusic = this.game.add.audio('bgMusic');
        //uses the tilemap json loaded from the preload script
        this.map = this.game.add.tilemap('grave');
        //users the image sppritespeet for the tileamp jason loaded by the preload
        this.map.addTilesetImage('thrillertile2', 'thrillertile');
        //sets the background color used for the sky in the game 
        this.stage.backgroundColor = "#2980b9";
        //inserts the tiles for the coulds nad bg no collision elements
        this.bg = this.map.createLayer('bg');
        //adds the house layer from the tile map
        this.house = this.map.createLayer('house');
        //adds the collison blocks from the tilemap
        this.collision = this.map.createLayer('collision');
        //sets the collision 
        this.map.setCollisionBetween(1, 100000, true, 'collision');
        //resizes this world to the width of the tile map
        this.bg.resizeWorld();
        //calls the below fuction to add the collectible music notes throughout the level
        this.createNotes();
        //loads the main image from the sprite sheet, creates the player
        this.player = this.game.add.sprite(10, 10, 'mjsprite', 'mj/awalk/0001');
        //this.player.scale.setTo(0.8, 0.8);
        //adds the arcade physics from the phaser library to the player
        this.game.physics.arcade.enable(this.player);
        //sets the players gravity
        this.player.body.gravity.y = 500;
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        this.playNow = this.game.add.audio('thril');
        //adds the scream adio for pplayer response
        this.playNote = this.game.add.audio('ahooo');
        this.bad = this.game.add.audio('bad');
        this.ho = this.game.add.audio('ho');

        //imports the game controller
        this.controller();

        //imports the keyboard
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //this is the score of the player always starts at 0
        this.score = 0;

        //boolean used to check if the bg music is playing
        this.musicIsPlaying = false;

        //starts to play the bg music

        this.thrillerMusic.play();
        this.isMoving = false;


        //creates a group object to hold all the zombie enemies
        this.zombieGroup = this.game.add.group();


        ///////////////////////////////////////////////////////////////////////////////////////////

        //                               player movement animations                              //

        ///////////////////////////////////////////////////////////////////////////////////////////
        this.player.animations.add('walk', Phaser.Animation.generateFrameNames('mj/awalk/', 1, 3, '', 4), 1.5, true, false);
        this.player.animations.add('kick', Phaser.Animation.generateFrameNames('mj/kick/', 5, 8, '', 4), 4.5, false, false);

        //used to indicate jump mode
        this.jump = false;
        //used to indicate kick mode
        this.kick = false;

        this.playerdead = false;
        console.log(started)


    },

    /////////////////////////////////////////////////////////////////////////////



    //                            Update methods                               //


    /////////////////////////////////////////////////////////////////////////////

    //updates the game states
    update: function () {

        //ensures the game caracter collides with the ground objects and doesn't fall through them 
        this.game.physics.arcade.collide(this.player, this.collision, this.groungHit, null, this);
        //ensures the game caracter collides with the ground objects and doesn't fall through them 
        this.game.physics.arcade.collide(this.player, this.zombieGroup, this.zombieHit, null, this);
        //this.game.physics.arcade.collide(this.zombie, this.collision);
        this.game.physics.arcade.collide(this.zombieGroup, this.collision);
        //this.game.physics.arcade.collide(this.zombie, this.player);
        //this collison detection is between the player and the music coin objects
        this.game.physics.arcade.overlap(this.player, this.notes, this.incrementScore, null, this);

        //moves the player will amend to the arrows
        this.player.body.velocity.x = 0;
        // this.player.body.velocity.y = 0;
        //when the up arrow is pressed
        if (this.cursors.right.isDown && this.cursors.up.isDown) {
            //test the up arrow is working

            this.mj();
        } else if (this.cursors.left.isDown) {
            console.log("moonwalk");
            this.mjleft();
        } else if (this.cursors.right.isDown) {
            console.log("walk");
            this.mjright();
        } else if (this.cursors.up.isDown) {
            console.log("up");

            this.mjJump();
        }


        //if the player falls down one of the gaps between blocks the game will enter game over state
        if (this.player.y >= this.game.world.height) {
            this.gameOver();
        }

        this.game.debug.text("MJ Score: " + this.score, 20, 20, "#fff", "20px comicsans");

        //this is when the player reaches the end of the level the game enters a new state
        if (this.player.x >= 15789) {
            //loads the complete screen
            this.complete();
        }



    }, //end update function


    /////////////////////////////////////////////////////////////////////////////


    //                     creates a new zombie object                         //


    /////////////////////////////////////////////////////////////////////////////

    //method to add a new zombie object using the Zombie prototype      
    addZombie: function (group) {

        console.log();
        //creates a new zombie object
        var zombie = new Zombie(this.game, this.player.x.valueOf());
        //adds the zombie to this game
        this.game.add.existing(zombie);
        //adds the new zombie to the group of zombies
        group.add(zombie);
    },



    //this function is used to get all of an object group
    //from a tilemap
    findMusicNotes: function (type, map, layer) {
        var notes = new Array();

        map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {

                element.y -= map.tileHeight;
                notes.push(element);
            }

        });

        return notes;
    },

    //creating sprites from the tiled object layer -- the music notes
    createSpriteFromTilMap: function (element, group) {
        var newSprite = group.create(element.x, element.y, element.properties.sprite);

        Object.keys(element.properties).forEach(function (key) {
            newSprite[key] == element.properties[key];
        });
    },

    //this is the fuction that th enotes are added to the game
    createNotes: function () {

        //creates a group to hold the notes
        this.notes = this.game.add.group();

        this.notes.enableBody = true;
        //uses the 2 above fuctions to add the notes
        var createNotes = this.findMusicNotes('note', this.map, 'notes');

        createNotes.forEach(function (element) {
            this.createSpriteFromTilMap(element, this.notes);
        }, this);

    },



    //this function is used to increment the players score
    //it is envoked when the player comes into contact with a music node
    incrementScore: function (player, item) {
        //the music note is destoryed/ removed from the game
        item.destroy();
        //the sounf is played 
        this.playNote.play();
        //the players score in incremented
        this.score++;
        //console.log(this.score);

        //this is where the scroe will be printed -  top left 
        this.game.debug.text("MJ Score: " + this.score, 20, 20, "#fff", "20px comicsans");
    },

    //method when player collides with the ground
    groungHit: function (player, collision) {
        // console.log("hit");
        if (this.jump === true) {
            this.player.animations.stop('jump');
            this.jump = false;
            this.player.frame = 1;
            //this.player.animations.start('stil');
        }

    },

    //method when player collides with the ground
    zombieHit: function (player, zombie) {
        console.log("hit");
        //zombie.x = +1;
        if (this.kick === true) {
            var destroyZombie = this.add.tween(zombie).to({
                x: zombie.x + this.rnd.between(300, 150),
                y: zombie.y - 200,
                rotation: 4

            }, 1000, Phaser.Easing.Linear.None, true);

            destroyZombie.onComplete.add(function () {
                //remobes this zombie object frem the game
                zombie.destroy();

            }, this);
        } else {
            this.playerdead = true;
            this.gameOver();
        }


    },
    /////////////////////////////////////////////////////////////////////////////



    //                         Movement finctions                             //


    /////////////////////////////////////////////////////////////////////////////
    //this fucntion is used to make the player 
    mjJump: function () {
        //  console.log(this.player.body.velocity.y);
        if (this.player.y < 720) {
            this.player.body.velocity.y -= 150;
        }
        if (started === false) {
            timer.start();
            started = true;
        }
        this.jump = true;
        // this.player.animations.play('jump');
        this.player.frame = 3;
        this.ho.play();
    },

    mjleft: function () {

        if (this.playerdead === false) {
            this.player.body.velocity.x -= 8;
        }
        // Start the timer
        if (started === false) {
            timer.start();
            started = true;
        }
        if (this.jump === false && this.kick === false) {
            this.walk();
        }

    },

    mjright: function () {

        if (this.playerdead === false) {
            this.player.body.velocity.x += 8;
        }
        // Start the timer
        if (started === false) {
            timer.start();
            started = true;
        }
        if (this.jump === false && this.kick === false) {
            this.walk();
        }

    },
    mj: function () {
        this.player.body.velocity.x += 8;
        this.player.body.velocity.y -= 150;
    },
    punch: function () {
        //console.log("Punch");
        this.playNote.play();
        if (started === false) {
            timer.start();
            started = true;
        }
    },
    mjKick: function () {
        // console.log("Kick");
        // this.playNote.play();
        if (started === false) {
            timer.start();
            started = true;
        }
        this.kick = true;
        this.bad.play();
        console.log(this.kick);
        this.player.animations.play('kick');

        this.player.animations.currentAnim.onComplete.add(function () {
            //console.log('animation complete');
            this.kick = false;
        }, this);

        console.log(this.kick);


    },
    walk: function () {
        if (this.jump === false) {
            this.player.animations.play('walk');
            // console.log("walking");
        }
    },
    stopWalk: function () {
        this.player.animations.stop('walk');
        //console.log("not walking");
    },


    /////////////////////////////////////////////////////////////////////////////////////



    /*                          Game controller                                         */



    //////////////////////////////////////////////////////////////////////////////////////
    //this fuction is used to import the gamecontroller js library and assign its values
    controller: function () {
        //checks if the controller has already been added to the game and if not add it now
        if (!GameController.hasInitiated) {
            var action = this;
            //inisalised the GameController and sets its properties
            this.GameController = GameController.init({

                //on the left hand side of the screen
                left: {
                    //sets the screen location
                    position: {
                        left: '15%',
                        bottom: '15%'
                    },
                    //the type of controller is a dpad
                    dpad: {
                        //Here i am removing the up and down buttons
                        up: false,
                        down: false,
                        //this is the the left button
                        left: {
                            //sets the size of the left button
                            width: '20%',
                            height: '10%',
                            //when this button is touched by the user
                            touchStart: function () {
                                //console.log('touch starts ');

                            },
                            //while the button is pressed down
                            touchMove: function (details) {
                                //movement
                                action.mjleft();
                                //animation 
                                action.walk();
                            },
                            //when the user stops touching this button
                            touchEnd: function (details) {
                                //stop animation
                                action.stopWalk();
                                // console.log("end touch");
                            },
                        },
                        //this is the right button
                        right: {
                            //sets the size of the right button
                            width: '20%',
                            height: '10%',
                            //when this button is touched by the user
                            touchStart: function () {
                                //console.log('touch starts ');

                            },
                            //while the button is pressed down
                            touchMove: function (details) {
                                //movement
                                action.mjright();
                                //animation 
                                //action.walk();
                            },
                            //when the user stops touching this button
                            touchEnd: function (details) {
                                //stop animation
                                action.stopWalk();
                                //console.log("end touch");
                            },
                        }
                    } //end of dpad
                }, //end of left side of the screen
                //on the right side of the screen add game controller elements
                right: {
                    //these elements will be buttons
                    type: 'buttons',
                    //sets the position of the buttons on screen
                    position: {
                        right: '10%',
                        bottom: '30%'
                    },
                    //create an array of buttons and set the style and action for each button
                    buttons: [
                        false,
                        //punch button
                            {
                                //will be wrote on the button
                                label: 'J',
                                //the radius - to set the button size
                                radius: 25,
                                //when this button is pressed
                                touchStart: function () {
                                        //player jump function
                                        action.mjJump();
                                    } //close touchStart
                        },
                        false,
                        //kick button
                            {
                                //will be wrote on the button
                                label: 'K',
                                //the radius - to set the button size
                                radius: 25,
                                //when a user touches the button
                                touchStart: function () {
                                    //player kick function
                                    action.mjKick();

                                },

                                touchEnd: function () {

                                    // that.pressingDown = false;

                                }
                        }
                    ] //close buttons array 

                }, //close right
            });
            //sets hasInitiated to true so it wont try add the controller more than once
            GameController.hasInitiated = true;

        }
    }, ///end of game controller

    /////////////////////////////////////////////////////////////////////////////


    //                        Render fuction & time handeler                   //


    /////////////////////////////////////////////////////////////////////////////

    render: function () {

        this.timeHandle();

    },

    //formats the time and time events
    timeHandle: function (s) {

        //formats the minues 
        mins = '0' + Math.floor((Math.round((timerEvent.delay - timer.ms) / 1000)) / 60);
        //formats the seconds
        sec = ((Math.round((timerEvent.delay - timer.ms) / 1000)) - mins * 60);

        mins.substr(-2);
        // sec.substr(-2);
        // console.log(mins);
        //  console.log(sec);

        //every 20 seconds
        if (sec == 00 || sec == 20 || sec == 40) {
            //used to eliminate miliseconds otherwise a second event would happen 60 times
            count = +1;
            //console.log(count);
        } else {
            if (count == 1) {
                //add a zombie object ----- see the addzombie method
                this.addZombie(this.zombieGroup);
                //resets count
                count = 0;
            }
        }
        // console.log("here" + count);

        //game over out of time
        if (mins == '00' && sec == 0) {
            console.log("times up");
            //loads game over screen
            this.gameOver();
        } else {
            //console.log("play now");
            //displays time
            this.game.debug.text(mins + ':' + sec, 590, 20, "#fff", "20px Courier");

        }
    },

    /////////////////////////////////////////////////////////////////////////////


    //                       Game over methods                                  //


    /////////////////////////////////////////////////////////////////////////////

    //this fuction is called when the player dies
    gameOver: function () {

        //test print game over
        console.log("game over");
        this.removeController();
        //here i need to load to the game over screen 
        /////////////////////////////////////////////
        //started = false;

        //changes to the game to the game over screen
        this.game.state.start('GameOver');

        //stops the backgroud music
        this.thrillerMusic.stop();
    },

    complete: function () {

        //test print cleared level
        console.log("cleared level");
        this.removeController();
        // started = false;
        //here i need to load to the game over screen 
        /////////////////////////////////////////////


        //changes to the game to the Complete screen
        this.game.state.start('Complete');

        //stops the backgroud music
        this.thrillerMusic.stop();

    },

    /////////////////////////////////////////////////////////////////////////////


    //                      Remove Controller method                           //


    /////////////////////////////////////////////////////////////////////////////

    removeController: function () {

        /*
        used for tested to ensure i delete the correct canvas and not the phaser game
        canvas
        console.log(document.getElementsByTagName("canvas")[1]);
            
        */

        /*this cretaes a varaible to hold the second canvas
        the second canvas holds the game controler 
        */
        var element = document.getElementsByTagName("canvas")[1];
        //the conext of this canvas if got and cleared to remove the buttons
        var context = element.getContext('2d');
        context.clearRect(0, 0, element.width, element.height);
        //now we need to delete this canvas to reinable the touch feature 
        //on the lower canvas on the next screen
        element.parentNode.removeChild(element);
        //sets the GameController.hasInitiated to false so that when a new game is 
        //started the gamecontroller will be readded
        GameController.hasInitiated = false;
        started = false;

    },



};
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