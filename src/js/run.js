/**
 * Init game objects and run once ready.
 * Wait for player confirmation (-> UiMenu) to start the game.
 */
window.onload = () => {
  Scene.init();
  UiMenu.init();

  UiMenu.ready(() => {
    FxShake.init();
    Loop.init();
    Score.init();
    UiHud.init();

    Loop.run();
    Scene.run();
  });
};
