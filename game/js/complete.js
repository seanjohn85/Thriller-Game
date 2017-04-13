var thrillerGame = thrillerGame || {};

//this function is used to load all the games assets 

thrillerGame.Complete = function () {};

//This the main menu Screen 
thrillerGame.Complete.prototype = {

    preload: function () {

        //addition game assets can be added here to load

    },

    create: function () {

        ///this will contain the 
        this.game.stage.backgroundColor = "#050409";


        this.comingsoon = this.game.add.image(550, 200, 'comingsoon');

        this.comingsoon.anchor.set(1);

        //sets the title to invisable
        this.comingsoon.alpha = 0;

        //fade in for the game title
        this.game.add.tween(this.comingsoon).to({
            alpha: 1
        }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);


        this.playGame = this.game.add.button(400, 320, 'playbtn', this.startNewGame);

        this.playGame.anchor.set(1);

        this.btnTween = this.game.add.tween(this.playGame).to({
            width: 100,
            height: 100
        }, 1400, 'Linear', true, 0, -1);

        this.btnTween.yoyo(true);


    },

    //this function is used to start a new game 
    startNewGame: function () {
        console.log("New Game Started");

        //starts the game state 
        this.game.state.start('Game');
    }


};