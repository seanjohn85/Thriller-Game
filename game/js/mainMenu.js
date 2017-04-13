var thrillerGame = thrillerGame || {};

//this function is used to load the main menu
thrillerGame.MainMenu = function () {};

//This the main menu Screen 
thrillerGame.MainMenu.prototype = {

    //the preload method is empty on this screen as everything was loaded in the previous state
    preload: function () {
        //addition game assets can be added here to load
    },

    create: function () {

        //this sets the stage colour - it shouls already be this from the previous screen
        this.game.stage.backgroundColor = "#050409";

        //adds and positions the title image on this screen
        this.title = this.game.add.image(550, 200, 'title');

        this.title.anchor.set(1);

        //sets the title to invisable
        this.title.alpha = 0;

        //fade in for the game title
        this.game.add.tween(this.title).to({
            alpha: 1
        }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

        //adds the play button with a trigger to the startNewGame function
        this.playGame = this.game.add.button(400, 320, 'playbtn', this.startNewGame);

        this.playGame.anchor.set(1);
        //sest the animation for the button
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