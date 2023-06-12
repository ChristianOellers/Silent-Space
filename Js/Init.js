/**
 * Initialize global game modules.
 */
var CanvasHelper = new Lib_CanvasHelper(),
    MathHelper   = new Lib_MathHelper(),
    Loop         = new Core_Loop(),
    Stage        = new Core_Stage(),
    Fx           = new Core_Fx(),
    Hud          = new Core_Hud(),
    Background   = new Obj_Background(),
    Ship_Player  = new Obj_Ship_Player()
    ;


// ----------------------------------------------------------------------------------------------------------------- Run

/**
 * Run the game.
 */
window.onload = function onload () {
    // ----------------------------------------------------------------------------------------------------------- Music

    // Todo: Sometimes the music play() function breaks as the audio seems to be not loaded yet.
    var music = document.getElementById('MusicAmbient');

    music.volume = 0.5;
    music.load(); 
    music.play();


    // --------------------------------------------------------------------------------------------------------- Effects

    Fx.init();
    
    // Particles
    for (var i = 0; i < 1; i++) {
        Stage.add(new Obj_Particle(), 'Particles');
    }


    // ----------------------------------------------------------------------------------------------------- Game engine

    Stage.add(Ship_Player, 'Game')
         .add(Hud,         'Hud')
         ;


    var rndStaticBackground = Math.random() * 5 | 0; // 0-4 ^= 20% chance

    Background.init();
    document.getElementById('GameHolder').className = 'static-image static-image-' + (rndStaticBackground-1);

    Loop.run();
};

