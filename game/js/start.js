//this object holds all the game data
var thrillerGame = thrillerGame || {};

//creates a new phaser game using the thrillerGame object and sets screen res -- 
//these settings are the best fit I could use without scrolling on the screen
thrillerGame.game = new Phaser.Game("100%", "100%", Phaser.AUTO, '');
//adds the boot see boot object 
thrillerGame.game.state.add('Boot', thrillerGame.Boot);
//adds the preload object-- game assets are loaded here to prevent lags in game play
thrillerGame.game.state.add('Preload', thrillerGame.Preload);
//adds the menu to start the game
thrillerGame.game.state.add('MainMenu', thrillerGame.MainMenu);
//adds the game 
thrillerGame.game.state.add('Game', thrillerGame.Game);
//adds the game over screen for when the player loses
thrillerGame.game.state.add('GameOver', thrillerGame.GameOver);
//if a player clears the game show the comple screen
thrillerGame.game.state.add('Complete', thrillerGame.Complete);
//starts the boot
thrillerGame.game.state.start('Boot');