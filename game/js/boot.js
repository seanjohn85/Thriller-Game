//this object holds all the game data, created if doesnt alread exist
var thrillerGame = thrillerGame || {};

thrillerGame.Boot = function () {};

//setting game configuration and loading the assets for the loading screen

thrillerGame.Boot.prototype = {

    preload: function () {

        //this is for the loading screen
        this.game.load.image('loading', 'assets/images/loading.png');

    },

    create: function () {

        //loading screen will have a punkin background

        this.game.stage.backgroundColor = "#050409";

        //scaling options

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally

        this.scale.pageAlignHorizontally = true;

        this.scale.pageAlignVertically = true;

        this.scale.setScreenSize = true;

        //physics system

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //this is the first state the boot loads
        this.state.start('Preload');

    }

};