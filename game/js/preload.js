//this object holds all the game data, created if doesnt alread exist
var thrillerGame = thrillerGame || {};

//this function is used to load all the games assets 
thrillerGame.Preload = function () {};

thrillerGame.Preload.prototype = {

    //all game assets are loaded into memory here before any  user interactivity
    preload: function () {

        //the loading bar image is loaded in the boot menu befor this page
        //loading screen
        var loading = this.add.sprite(300, 300, "loading");
        loading.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(loading);

        /*********     Title Screen assets   ***********/

        //the game logo image
        this.load.image('title', 'assets/images/title.png'); //
        //the play now button image
        this.load.image('playbtn', 'assets/images/playbtn.png');

        /*********     All Game assets loaded to prevent in game lagging!     ***********/

        //loads the tilemap json and labels a reference to it as grave
        this.load.tilemap('grave', 'assets/tilemap/test.json', null, Phaser.Tilemap.TILED_JSON);

        //this.load.atlasJSONArray('main', 'assets/images/mjs.png', 'assets/images/mjs.json');
        this.load.atlasJSONArray('zombie', 'assets/images/sprites/zombie.png', 'assets/images/sprites/zombie.json');

        //loads the tilemap spritesheet labels it thrillertile
        this.load.image('thrillertile', 'assets/tilemap/thrillertile2.png');

        this.load.atlasJSONHash('mjsprite', 'assets/images/mjsprite/mjsprite.png', 'assets/images/mjsprite/mjsprite.json');

        //loads the music note image 
        this.load.image('music', 'assets/images/music.png');

        ///////////////////////////////////////////////////////////
        ///////////////          load sounds     //////////////////

        //shout sounds loaded
        this.load.audio('ahooo', 'assets/sounds/aoh.wav');
        this.load.audio('bad', 'assets/sounds/bad.wav');
        this.load.audio('ho', 'assets/sounds/hoooooooo.wav');

        //thriller background music loaded
        this.load.audio('bgMusic', 'assets/sounds/thriller.wav');
        this.load.audio('thril', 'assets/sounds/mjthril.mp3');


        /*********      Complete assets     ***********/

        //the comingsoon text image
        this.load.image('comingsoon', 'assets/images/clear.png');


        /*********      Game Over assets     ***********/

        //the game over text image
        this.load.image('gameOver', 'assets/images/gameover.png');
        this.game.load.image('loading2', 'assets/images/loading.png');


    },
    //once the assets are finished loadint use the create method to load the next screen
    create: function () {
        //the first user interactive state MainMenu is loaded here
        this.state.start('MainMenu');
    }

};