export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindUpdateFrame(this.handleUpdateFrame.bind(this));
    this.view.bindPauseGame(this.handlePauseGame.bind(this));
    this.view.bindAutoClick(this.handleAutoClick.bind(this));
    this.view.bindNewGameClick(this.handleNewGame.bind(this));
    this.view.bindSaveClick(this.handleSave.bind(this));
    this.view.bindSavedGameClick(this.handleGameLoad.bind(this));
    this.view.bindGameSizeClick(this.handleSizeChange.bind(this));
    this.view.bindTileStyleClick(this.handleStyleChange.bind(this));
    this.view.bindLoadClick(this.handleLoadClick.bind(this));
    this.view.bindBestClick(this.handleBestClick.bind(this));
    this.view.bindAboutClick(this.handleAboutClick.bind(this));
    this.view.bindSettingsClick(this.handleSettingsClick.bind(this));
    this.model.bindTilesSwap(this.onTilesSwap.bind(this));
    this.model.bindTimeChange(this.onTimeChange.bind(this));
    this.model.bindPause(this.onPause.bind(this));
    this.model.bindWin(this.onWin.bind(this));
    this.model.bindSave(this.onSave.bind(this));
  }

  init() {
    this.view.displayMenu();
  }

  start() {
    this.model.createFrame();
    this.view.displayTiles(this.model.tiles);
    this.model.countTime();
    this.view.showTime(this.model.time);
    this.view.showMoves(this.model.moves);
    this.view.showSound();
    this.view.showPause();
    this.view.showAuto();
  }

  reset() {
    this.model.tiles = [];
    this.model.history = [];
    this.model.time = 0;
    this.model.moves = 0;
    this.model.isPaused = false;
    clearInterval(this.model.timer);
    this.view.dashboard.textContent = '';
  }

  load(save) {
    this.model.loadData(save);
    this.view.size = this.model.size;
    this.view.style = this.model.style;
    this.view.changeFloor();
    this.view.displayTiles(this.model.tiles);
    this.model.countTime();
    this.view.showTime(this.model.time);
    this.view.showMoves(this.model.moves);
    this.view.showSound();
    this.view.showPause();
    this.view.showAuto();
  }

  onTilesSwap(tiles, moves) {
    this.view.updateTiles(tiles);
    this.view.showMoves(moves);
  }

  handleUpdateFrame(swapIndex) {
    this.model.updateFrame(swapIndex);
  }

  onTimeChange(time) {
    this.view.showTime(time);
  }

  onPause() {
    this.view.showPauseMessage();
  }

  onWin(time, moves) {
    this.view.showWinMessage(time, moves);
  }

  onSave() {
    this.view.showSaveMessage();
  }

  handlePauseGame() {
    this.model.isPaused = !this.model.isPaused;
    this.model.countTime();
  }

  handleAutoClick() {
    this.model.isAuto = true;
    this.view.showSolution(this.model.solvePuzzle());
  }

  handleNewGame() {
    this.reset();
    this.start();
  }

  handleSave() {
    this.model.save();
  }

  handleLoadClick() {
    this.view.displayLoadMenu(this.model.savedGames);
  }

  handleBestClick() {
    const records = this.model.bestRecords;
    const relevantRecords = records.find((array) => {
      const isSameSize = array[0].size === this.model.size;
      const isSameStyle = array[0].style === this.model.style;
      return isSameSize && isSameStyle;
    });
    const thisConfigRecs = relevantRecords || [];
    this.view.displayBestResults(thisConfigRecs);
  }

  handleAboutClick() {
    this.view.displayAbout();
  }

  handleSettingsClick() {
    this.view.displaySettings();
  }

  handleGameLoad(game) {
    const save = this.model.savedGames.find((item) => item.date === game.dataset.date);
    if (save) {
      this.view.loadMenu.innerHTML = '';
      this.load(save);
    }
  }

  handleSizeChange(newSize) {
    this.reset();
    this.model.size = +newSize;
    this.view.size = +newSize;
    this.model.createFrame();
    this.view.displayMenu();
    this.view.displaySettings();
  }

  handleStyleChange(newStyle) {
    this.reset();
    this.view.style = +newStyle;
    this.model.style = +newStyle;
    this.view.changeFloor();
    this.model.createFrame();
    this.view.displayMenu();
    this.view.displaySettings();
  }
}
