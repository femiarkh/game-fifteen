import pictures from '../utils/pictures';
import utils from '../utils/utils';

export default class View {
  constructor(size) {
    this.size = size;
    this.container = utils.createElement('div', 'container');
    this.dashboard = utils.createElement('div', 'dashboard');
    this.frameList = utils.createElement('ul', 'frame-list');
    this.frameList.classList.add(`frame-list-${size}`);
    this.gameMenu = utils.createElement('ul', 'game-menu');
    this.loadMenu = utils.createElement('div', 'load-menu');
    this.bestResults = utils.createElement('div', 'best-results');
    this.about = utils.createElement('div', 'about');
    this.settingsMenu = utils.createElement('div', 'settings-menu');
    this.container.append(this.dashboard);
    this.container.append(this.frameList);
    document.body.append(this.container);
    this.soundIsOn = true;
    this.style = 0;
    this.tilesLi = [];
    this.isAuto = false;
    this.isPause = false;
  }

  displayMenu() {
    this.gameMenu.style.backgroundImage = '';
    this.gameMenu.innerHTML = '<li class="game-name"><table class="game-name-table"><tr><td class="rss-word">R</td><td class="rss-word">S</td><td class="rss-word">S</td><td class="gem-puzzle-name"><span class="gem-word">Gem</span><span class="puzzle-word">Puzzle</span></td></tr></table></li><li class="game-menu-item">New Game</li><li class="game-menu-item">Load</li><li class="game-menu-item">Best Scores</li><li class="game-menu-item">About</li><li class="game-menu-item">Settings</li>';
    this.frameList.append(this.gameMenu);
  }

  displayLoadMenu(savedGames) {
    this.loadMenu.innerHTML = '';
    const loadMenuHeader = utils.createElement('h2', 'load-menu-header');
    loadMenuHeader.textContent = 'Load';
    const savesList = utils.createElement('ol', 'saves-list');
    const backButton = utils.createElement('button', 'back-button');
    backButton.textContent = 'Back';
    savedGames.forEach((save) => {
      const saveItem = utils.createElement('li', 'save-item');
      const saveDate = new Date(Date.parse(save.date));
      saveItem.setAttribute('data-date', save.date);
      const saveMonth = saveDate.getMonth() + 1;
      const saveDay = saveDate.getDate();
      const saveHours = utils.padWithZeroes(saveDate.getHours());
      const saveMinutes = utils.padWithZeroes(saveDate.getMinutes());
      const saveSeconds = utils.padWithZeroes(saveDate.getSeconds());
      saveItem.innerHTML = `${saveMonth}/${saveDay}, ${saveHours}:${saveMinutes}:${saveSeconds} (${save.size}x${save.size}, ${save.moves}mov, ${save.time}sec)<br><span class="load-picture">${save.style === 0 ? 'digits' : pictures[save.style - 1].name}</span>`;
      savesList.append(saveItem);
    });
    const noSavesBox = utils.createElement('div', 'no-save');
    noSavesBox.textContent = 'No saves yet';
    this.loadMenu.append(loadMenuHeader);
    if (savedGames.length !== 0) {
      this.loadMenu.append(savesList);
    } else {
      this.loadMenu.append(noSavesBox);
    }
    this.loadMenu.append(backButton);
    this.gameMenu.append(this.loadMenu);
  }

  displayBestResults(records) {
    this.bestResults.innerHTML = '';
    const recordsHeader = utils.createElement('h2', 'records-header');
    recordsHeader.textContent = `${this.size}x${this.size}`;
    const recordsSubheader = utils.createElement('h2', 'records-subheader');
    if (this.style === 0) {
      recordsSubheader.textContent = 'Digits';
    } else {
      recordsSubheader.textContent = `«${pictures[this.style - 1].name}»`;
    }
    const recordsTable = utils.createElement('table', 'records-table');
    const backButton = utils.createElement('button', 'back-button');
    backButton.textContent = 'Back';
    records.forEach((record, index) => {
      const tr = utils.createElement('tr');
      const tdPlace = utils.createElement('td');
      const tdMov = utils.createElement('td');
      const tdTime = utils.createElement('td');
      tdPlace.textContent = `${index + 1}`;

      const formattedTimeArray = utils.formatTime(record.time).split(':');
      let timeMessage;
      switch (formattedTimeArray.length) {
        case 3:
          timeMessage = `${+formattedTimeArray[0]} h ${+formattedTimeArray[1]} min ${+formattedTimeArray[2]} sec`;
          break;
        case 2:
          timeMessage = `${+formattedTimeArray[0]} min ${+formattedTimeArray[1]} sec`;
          break;
        default:
          timeMessage = `${+formattedTimeArray[0]} sec`;
      }

      tdTime.textContent = timeMessage;
      tdMov.textContent = `${record.moves} moves`;
      tr.append(tdPlace);
      tr.append(tdTime);
      tr.append(tdMov);
      recordsTable.append(tr);
    });
    const noRecordsBox = utils.createElement('div', 'no-records');
    noRecordsBox.textContent = 'No records yet';
    this.bestResults.append(recordsHeader);
    this.bestResults.append(recordsSubheader);
    if (records.length !== 0) {
      this.bestResults.append(recordsTable);
    } else {
      this.bestResults.append(noRecordsBox);
    }
    this.bestResults.append(backButton);
    this.bestResults.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Back') {
        this.bestResults.innerHTML = '';
        this.bestResults.remove();
      }
    });
    this.gameMenu.append(this.bestResults);
  }

  displayAbout() {
    this.about.innerHTML = '';
    const aboutHeader = utils.createElement('h2', 'about-header');
    aboutHeader.textContent = 'About';
    const aboutText = utils.createElement('div', 'about-text');
    aboutText.innerHTML = '<p>Раскладка классическая, то есть цифры нужно расставить по порядку слева направо, сверху вниз. Пустой должна остаться последняя клетка.</p><p>Таблица рекордов заводится отдельная для каждого стиля костяшек и каждого размера. То есть, к примеру, у 3x3 «Алёнушки», 5x5 «Алёнушки», 3x3 «Садко», 5x5 «Садко» будут свои рекорды.</p><p>Сами рекорды рассчитываются сразу по двум параметрам, поэтому возможны случаи, когда времени затрачено больше, но результат выше в рейтинге за счёт того, что сделано меньше ходов. И наоборот.</p><p>Если вы столкнулись с проблемой или у вас возникли вопросы по игре, пишите на femiarkh@gmail.com или в дискорд Dammy#7897.</p>';
    const backButton = utils.createElement('button', 'back-button');
    backButton.textContent = 'Back';
    this.about.append(aboutHeader);
    this.about.append(aboutText);
    this.about.append(backButton);
    this.about.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Back') {
        this.about.innerHTML = '';
        this.about.remove();
      }
    });
    this.gameMenu.append(this.about);
  }

  displaySettings() {
    function generatePictureOptions(numberOfPictures) {
      let options = '';
      for (let i = 0; i < numberOfPictures; i += 1) {
        const picture = pictures[i];
        options += `<option value="${i + 1}">${i + 1}. ${picture.name}</option>`;
      }
      return options;
    }

    const NUMBER_OF_PICTURES = 150;
    this.settingsMenu.innerHTML = '';
    const settingsHeader = utils.createElement('h2', 'settings-header');
    settingsHeader.textContent = 'Settings';
    const settingsWarning = utils.createElement('p', 'settings-warning');
    settingsWarning.textContent = 'Current game would be lost once you change these settings';
    const chooseSizeBox = utils.createElement('div', 'choose-size-box');
    chooseSizeBox.innerHTML = '<div class="settings-box"><h3 class="settings-subheader">Board size</h3><label for "game-size">Choose size: </label><select name="game-size" id="game-size"><option value="3">3x3</option><option value="4">4x4</option><option value="5">5x5</option><option value="6">6x6</option><option value="7">7x7</option><option value="8">8x8</option></select></div>';
    chooseSizeBox.querySelector(`option[value="${this.size}"]`).selected = true;
    const chooseStyleBox = utils.createElement('div', 'choose-style-box');
    chooseStyleBox.innerHTML = `<div class="settings-box"><h3 class="settings-subheader">Style of tiles</h3><label for "game-size">Choose style: </label><select name="tile-style" id="tile-style"><option value="0">0. Digits</option>${generatePictureOptions(NUMBER_OF_PICTURES)}</select></div>`;
    chooseStyleBox.querySelector(`option[value="${this.style}"]`).selected = true;
    const backButton = utils.createElement('button', 'back-button');
    backButton.textContent = 'Back';
    this.settingsMenu.append(settingsHeader);
    this.settingsMenu.append(settingsWarning);
    this.settingsMenu.append(chooseSizeBox);
    this.settingsMenu.append(chooseStyleBox);
    this.settingsMenu.append(backButton);
    this.settingsMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Back') {
        this.settingsMenu.innerHTML = '';
        this.settingsMenu.remove();
      }
    });
    this.gameMenu.append(this.settingsMenu);
  }

  displayTiles(tiles) {
    while (this.frameList.firstChild) {
      this.frameList.removeChild(this.frameList.firstChild);
    }
    if (this.tilesLi.length !== 0) {
      this.tilesLi = [];
    }
    const zeroIndex = tiles.indexOf(0);
    tiles.forEach((tile, index) => {
      const li = utils.createElement('li', 'tile');
      li.classList.add(`tile-${this.size}`);
      const indexDiff = Math.abs(index - zeroIndex);
      const isSameRow = Math.floor(index / this.size) === Math.floor(zeroIndex / this.size);
      if ((indexDiff === 1 && isSameRow) || indexDiff === this.size) {
        li.classList.add('tile-movable');
      }
      li.setAttribute('data-id', tile);
      if (this.style === 0) {
        li.textContent = tile === 0 ? '' : tile;
      } else if (tile !== 0) {
        li.textContent = '';
        const liColumn = (tile - 1) % this.size;
        const liRow = Math.floor((tile - 1) / this.size);
        const percent = 100 / (this.size - 1);
        li.style.backgroundImage = `url(./assets/images/frames/${this.style}.jpg)`;
        li.style.backgroundSize = `${this.frameList.clientWidth}px ${this.frameList.clientHeight}px`;
        li.style.backgroundPosition = `${liColumn * percent}% ${liRow * percent}%`;
      }
      if (tile === 0) {
        li.classList.add('zero-tile');
      }
      this.tilesLi.push(li);
      this.frameList.append(li);
    });
    window.addEventListener('resize', () => {
      const tilesArray = Array.from(this.frameList.querySelectorAll('.tile'));
      tilesArray.forEach((tile) => {
        const tileLi = tile;
        tileLi.style.backgroundSize = `${this.frameList.clientWidth}px ${this.frameList.clientHeight}px`;
      });
    });
  }

  updateTiles(tiles) {
    while (this.frameList.firstChild) {
      this.frameList.removeChild(this.frameList.firstChild);
    }
    tiles.forEach((tile) => {
      const theLi = this.tilesLi.find((li) => +li.dataset.id === tile);
      this.frameList.append(theLi);
    });
    this.tilesLi = Array.from(this.frameList.querySelectorAll('.tile'));
    this.updateGlow();
  }

  updateGlow() {
    this.tilesLi.forEach((tile) => {
      tile.classList.remove('tile-movable');
    });
    if (this.isAuto) {
      return;
    }
    const zeroIndex = this.tilesLi.findIndex((tile) => tile.dataset.id === '0');
    const glowingTiles = this.tilesLi.slice().filter((tile, index) => {
      const indexDiff = Math.abs(zeroIndex - index);
      const isSameRow = Math.floor(index / this.size) === Math.floor(zeroIndex / this.size);
      return (indexDiff === 1 && isSameRow) || indexDiff === this.size;
    });
    glowingTiles.forEach((glowingTile) => {
      glowingTile.classList.add('tile-movable');
    });
  }

  changeFloor() {
    this.frameList.style.backgroundImage = this.style === 0 ? 'url("./assets/images/floor.jpg")' : `linear-gradient(rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.6)),url("./assets/images/frames/${this.style}.jpg")`;
  }

  showTime(time) {
    if (this.dashboard.querySelector('.time-box')) {
      this.dashboard.querySelector('.time-box').remove();
    }
    const timeBox = utils.createElement('span', 'time-box');
    timeBox.innerHTML = `Time: <span class="time-digits">${utils.formatTime(time)}</span>`;
    this.dashboard.append(timeBox);
  }

  showMoves(moves) {
    if (this.dashboard.querySelector('.moves')) {
      this.dashboard.querySelector('.moves').remove();
    }
    const movesBox = utils.createElement('span', 'moves');
    movesBox.innerHTML = `Moves: <span class="move-digits">${moves}</span>`;
    this.dashboard.append(movesBox);
  }

  showSound() {
    if (this.dashboard.querySelector('.sound')) {
      return;
    }
    const soundIcon = utils.createElement('div', 'sound');
    soundIcon.innerHTML = this.soundIsOn ? '<img src="./assets/icons/volume-up.svg" width="30" height="30">' : '<img src="./assets/icons/volume-off.svg" width="30" height="30">';
    this.dashboard.append(soundIcon);
    this.dashboard.addEventListener('click', (evt) => {
      const iconBox = evt.target.parentElement;
      if (!iconBox) {
        return;
      }
      if (iconBox.classList.contains('sound')) {
        this.soundIsOn = !this.soundIsOn;
        iconBox.innerHTML = this.soundIsOn ? '<img src="./assets/icons/volume-up.svg" width="30" height="30">' : '<img src="./assets/icons/volume-off.svg" width="30" height="30">';
      }
    });
  }

  showAuto() {
    if (this.dashboard.querySelector('.auto')) {
      this.dashboard.querySelector('.auto').remove();
    }
    const autoBox = utils.createElement('span', 'auto');
    autoBox.textContent = 'Auto';
    this.dashboard.append(autoBox);
  }

  showPause() {
    if (this.dashboard.querySelector('.pause')) {
      return;
    }
    const pauseBox = utils.createElement('span', 'pause');
    pauseBox.textContent = 'Pause';
    this.dashboard.append(pauseBox);
  }

  showPauseMessage() {
    this.isPause = true;
    this.dashboard.querySelector('.pause').classList.toggle('pause-active', this.isPause);
    this.gameMenu.style.backgroundImage = '';
    this.gameMenu.innerHTML = '<li class="game-menu-item">Resume</li><li class="game-menu-item">New Game</li><li class="game-menu-item">Save</li><li class="game-menu-item">Load</li><li class="game-menu-item">Best Scores</li><li class="game-menu-item">Settings</li>';
    const pauseMessage = utils.createElement('li', 'pause-message');
    pauseMessage.textContent = 'Game is paused';
    this.gameMenu.prepend(pauseMessage);
    this.frameList.append(this.gameMenu);
  }

  showWinMessage(time, moves) {
    if (!this.isAuto) {
      const winBox = utils.createElement('li', 'win-message');
      const formattedTimeArray = utils.formatTime(time).split(':');
      let timeMessage = '';
      let hoursWord = '';
      let minutesWord = '';
      let secondsWord = '';
      switch (formattedTimeArray.length) {
        case 3:
          hoursWord = (formattedTimeArray[0] === '01') ? 'hour' : 'hours';
          minutesWord = (formattedTimeArray[1] === '01') ? 'minute' : 'minutes';
          secondsWord = (formattedTimeArray[2] === '01') ? 'second' : 'seconds';
          timeMessage = `${+formattedTimeArray[0]} ${hoursWord}, ${+formattedTimeArray[1]} ${minutesWord} and ${+formattedTimeArray[2]} ${secondsWord}`;
          break;
        case 2:
          minutesWord = (formattedTimeArray[0] === '01') ? 'minute' : 'minutes';
          secondsWord = (formattedTimeArray[1] === '01') ? 'second' : 'seconds';
          timeMessage = `${+formattedTimeArray[0]} ${minutesWord} and ${+formattedTimeArray[1]} ${secondsWord}`;
          break;
        default:
          secondsWord = (formattedTimeArray[0] === '01') ? 'second' : 'seconds';
          timeMessage = `${+formattedTimeArray[0]} ${secondsWord}`;
      }
      winBox.innerHTML = `Congrats!<br>You solved this puzzle<br>in ${timeMessage}<br>with ${moves} moves`;
      this.gameMenu.innerHTML = '<li class="game-menu-item">New Game</li><li class="game-menu-item">Load</li><li class="game-menu-item">Best Scores</li><li class="game-menu-item">Settings</li>';
      if (this.style !== 0) {
        this.gameMenu.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this.gameMenu.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1)),url("./assets/images/frames/${this.style}.jpg")`;
        const pictureNameBox = utils.createElement('li', 'picture-info');
        pictureNameBox.textContent = `${pictures[this.style - 1].author}, «${pictures[this.style - 1].name}», ${pictures[this.style - 1].year}г.`;
        this.gameMenu.prepend(pictureNameBox);
      }
      this.gameMenu.prepend(winBox);
      this.frameList.append(this.gameMenu);
      let audio;
      if (!document.querySelector('[data-sound=win]')) {
        audio = utils.createElement('audio');
        audio.setAttribute('data-sound', 'win');
        audio.src = 'assets/sounds/win.wav';
        document.body.append(audio);
      } else {
        audio = document.querySelector('[data-sound=win]');
      }
      if (this.soundIsOn) {
        audio.play();
      }
    } else {
      this.isAuto = false;
      window.removeEventListener('blur', this.onAutoBlur);
      window.removeEventListener('focus', this.onAutoFocus);
      this.gameMenu.innerHTML = '<li class="game-menu-item try-again">Try Again</li><li class="game-menu-item">Load</li><li class="game-menu-item">Best Scores</li><li class="game-menu-item">Settings</li>';
      this.frameList.append(this.gameMenu);
      let audio;
      if (!document.querySelector('[data-sound=auto-win]')) {
        audio = utils.createElement('audio');
        audio.setAttribute('data-sound', 'auto-win');
        audio.src = 'assets/sounds/auto-win.wav';
        document.body.append(audio);
      } else {
        audio = document.querySelector('[data-sound=auto-win]');
      }
      if (this.soundIsOn) {
        audio.play();
      }
    }
  }

  showSaveMessage() {
    const saveBox = utils.createElement('div', 'save-message');
    saveBox.textContent = 'Game is saved!';
    this.frameList.append(saveBox);
    setTimeout(() => {
      saveBox.remove();
    }, 1000);
  }

  showSolution(path) {
    this.isAuto = true;
    this.dashboard.querySelector('.auto').classList.toggle('auto-active', this.isAuto);
    this.updateGlow();

    const solvingPath = path.slice();
    const click = new Event('click', { bubbles: true });

    let i = 0;

    const autoSolve = setInterval(() => {
      let tilesInFrame = this.frameList.querySelectorAll('.tile');
      tilesInFrame[solvingPath[i]].dispatchEvent(click);
      tilesInFrame = this.frameList.querySelectorAll('.tile');
      i += 1;
      if (i === solvingPath.length) {
        this.dashboard.querySelector('.auto').classList.remove('auto-active');
        clearInterval(autoSolve);
        window.removeEventListener('blur', this.onAutoBlur);
        window.removeEventListener('focus', this.onAutoFocus);
      }
    }, 300);

    this.onAutoBlur = () => {
      const pause = this.dashboard.querySelector('.pause');
      pause.dispatchEvent(click);
      this.isPause = true;
      pause.classList.toggle('pause-active', this.isPause);
      clearInterval(autoSolve);
      window.removeEventListener('blur', this.onAutoBlur);
    };

    this.onAutoFocus = () => {
      const pause = this.dashboard.querySelector('.pause');
      pause.dispatchEvent(click);
      this.isPause = false;
      pause.classList.toggle('pause-active', this.isPause);
      window.removeEventListener('focus', this.onAutoFocus);
      this.showSolution(solvingPath.slice(i));
    };

    window.addEventListener('blur', this.onAutoBlur);
    window.addEventListener('focus', this.onAutoFocus);
  }

  bindSavedGameClick(handler) {
    this.loadMenu.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('save-item')) {
        handler(evt.target);
      }
      if (evt.target.classList.contains('load-picture')) {
        handler(evt.target.parentElement);
      }
      if (evt.target.textContent === 'Back') {
        this.loadMenu.innerHTML = '';
        this.loadMenu.remove();
      }
    });
  }

  bindGameSizeClick(handler) {
    this.settingsMenu.addEventListener('change', (evt) => {
      if (evt.target.id === 'game-size') {
        handler(evt.target.value);
      }
    });
  }

  bindTileStyleClick(handler) {
    this.settingsMenu.addEventListener('change', (evt) => {
      if (evt.target.id === 'tile-style') {
        handler(evt.target.value);
      }
    });
  }

  bindNewGameClick(handler) {
    this.gameMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'New Game' || evt.target.textContent === 'Try Again') {
        handler();
      }
    });
  }

  bindSaveClick(handler) {
    this.gameMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Save') {
        handler();
      }
    });
  }

  bindLoadClick(handler) {
    this.gameMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Load') {
        handler();
      }
    });
  }

  bindBestClick(handler) {
    this.gameMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Best Scores') {
        handler();
      }
    });
  }

  bindAboutClick(handler) {
    this.gameMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'About') {
        handler();
      }
    });
  }

  bindSettingsClick(handler) {
    this.gameMenu.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Settings') {
        handler();
      }
    });
  }

  bindPauseGame(handler) {
    this.dashboard.addEventListener('click', (evt) => {
      if (this.frameList.querySelector('.win-message') || this.frameList.querySelector('.try-again')) {
        return;
      }
      if (evt.target.classList.contains('pause')) {
        if (this.isAuto && evt.isTrusted) {
          return;
        }
        if (this.frameList.querySelector('.pause-message')) {
          this.dashboard.querySelector('.pause').classList.remove('pause-active');
          this.frameList.querySelector('.game-menu').remove();
        }
        handler();
      }
    });
    this.frameList.addEventListener('click', (evt) => {
      if (evt.target.textContent === 'Resume') {
        if (this.frameList.querySelector('.pause-message')) {
          this.dashboard.querySelector('.pause').classList.remove('pause-active');
          this.frameList.querySelector('.game-menu').remove();
        }
        handler();
      }
    });
  }

  bindAutoClick(handler) {
    this.dashboard.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('auto')) {
        if (!this.isAuto && !this.frameList.querySelector('.game-menu')) {
          handler();
        }
      }
    });
  }

  bindUpdateFrame(handler) {
    this.frameList.addEventListener('mousedown', (evt) => {
      const tile = evt.target;
      const mouseDownX = evt.clientX;
      const mouseDownY = evt.clientY;
      const shiftX = mouseDownX - tile.getBoundingClientRect().left;
      const shiftY = mouseDownY - tile.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        tile.style.left = `${pageX - shiftX}px`;
        tile.style.top = `${pageY - shiftY}px`;
      }

      function onMouseMove(ev) {
        moveAt(ev.pageX, ev.pageY);
      }

      if (evt.target.classList.contains('tile')) {
        if (this.isAuto) {
          return;
        }
        if (this.mouseDownTime) {
          const now = new Date().getTime();
          if (now - this.mouseDownTime < 300) {
            return;
          }
        }
        this.mouseDownTime = new Date().getTime();
        const frameListArray = Array.from(this.frameList.querySelectorAll('.tile'));
        const zeroIndex = frameListArray.indexOf(frameListArray.find((item) => item.getAttribute('data-id') === '0'));
        const index = this.tilesLi.indexOf(tile);
        const indexDiff = Math.abs(zeroIndex - index);
        const zeroRow = Math.floor(zeroIndex / this.size);
        const indexRow = Math.floor(index / this.size);

        if ((indexDiff === 1 && zeroRow === indexRow) || indexDiff === this.size) {
          const computedStyle = getComputedStyle(tile);
          const paddingTile = utils.createElement('li', 'tile');
          paddingTile.style.width = computedStyle.width;
          paddingTile.style.height = computedStyle.height;
          paddingTile.style.background = 'transparent';
          paddingTile.style.borderColor = 'transparent';
          tile.before(paddingTile);
          const tileClone = tile.cloneNode();
          tileClone.textContent = tile.textContent;
          tile.style.position = 'absolute';
          tile.style.zIndex = 9999;
          tile.style.width = computedStyle.width;
          tile.style.height = computedStyle.height;

          document.body.append(tile);

          moveAt(evt.pageX, evt.pageY);

          document.addEventListener('mousemove', onMouseMove);

          tile.onmouseup = (e) => {
            const mouseUpX = e.clientX;
            const mouseUpY = e.clientY;
            document.removeEventListener('mousemove', onMouseMove);
            tile.onmouseup = null;
            const now = new Date().getTime();
            const timeDiff = now - this.mouseDownTime;
            const distanceX = Math.abs(mouseUpX - mouseDownX);
            const distanceY = Math.abs(mouseUpY - mouseDownY);
            if (distanceX < 10 && distanceY < 10 && timeDiff < 300) {
              const absoluteIndexDiff = zeroIndex - index;
              switch (absoluteIndexDiff) {
                case 1:
                  tile.classList.add('tile-right');
                  break;
                case this.size:
                  tile.classList.add('tile-down');
                  break;
                case -1:
                  tile.classList.add('tile-left');
                  break;
                default:
                  tile.classList.add('tile-up');
              }
              tile.addEventListener('transitionend', () => {
                let audio;
                if (!document.querySelector('[data-sound=tile-swap]')) {
                  audio = utils.createElement('audio');
                  audio.setAttribute('data-sound', 'tile-swap');
                  audio.src = 'assets/sounds/tile-swap.wav';
                  document.body.append(audio);
                } else {
                  audio = document.querySelector('[data-sound=tile-swap]');
                }
                if (this.soundIsOn) {
                  audio.play();
                }
                this.tilesLi[index] = tileClone;
                tile.remove();
                handler(index);
              });
            } else {
              const tileWidth = parseInt(computedStyle.width, 10);
              const tileHeight = parseInt(computedStyle.height, 10);
              const tileCoords = tile.getBoundingClientRect();
              const tileCenterX = tileCoords.left + (tileWidth / 2);
              const tileCenterY = tileCoords.top + (tileHeight / 2);
              const zeroTileCoords = frameListArray[zeroIndex].getBoundingClientRect();
              const zeroCenterX = zeroTileCoords.left + (tileWidth / 2);
              const zeroCenterY = zeroTileCoords.top + (tileHeight / 2);
              const centerDiffX = Math.abs(zeroCenterX - tileCenterX);
              const centerDiffY = Math.abs(zeroCenterY - tileCenterY);

              if (centerDiffX < tileWidth * 0.3 && centerDiffY < tileHeight * 0.3) {
                let audio;
                if (!document.querySelector('[data-sound=tile-swap]')) {
                  audio = utils.createElement('audio');
                  audio.setAttribute('data-sound', 'tile-swap');
                  audio.src = 'assets/sounds/tile-swap.wav';
                  document.body.append(audio);
                } else {
                  audio = document.querySelector('[data-sound=tile-swap]');
                }
                if (this.soundIsOn) {
                  audio.play();
                }
                this.tilesLi[index] = tileClone;
                tile.remove();
                handler(index);
              } else {
                this.tilesLi[index] = tileClone;
                tile.remove();
                paddingTile.replaceWith(tileClone);
              }
            }
          };

          tile.ondragstart = () => false;
        }
      }
    });

    this.frameList.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('tile')) {
        if (!evt.isTrusted) {
          const tile = evt.target;
          const tileClone = tile.cloneNode();
          tileClone.textContent = tile.textContent;
          const frameListArray = Array.from(this.frameList.querySelectorAll('.tile'));
          const zeroIndex = frameListArray.indexOf(frameListArray.find((item) => item.getAttribute('data-id') === '0'));
          const index = this.tilesLi.indexOf(tile);
          const absoluteIndexDiff = zeroIndex - index;
          switch (absoluteIndexDiff) {
            case 1:
              tile.classList.add('tile-right');
              break;
            case this.size:
              tile.classList.add('tile-down');
              break;
            case -1:
              tile.classList.add('tile-left');
              break;
            default:
              tile.classList.add('tile-up');
          }
          tile.addEventListener('transitionend', () => {
            let audio;
            if (!document.querySelector('[data-sound=tile-swap]')) {
              audio = utils.createElement('audio');
              audio.setAttribute('data-sound', 'tile-swap');
              audio.src = 'assets/sounds/tile-swap.wav';
              document.body.append(audio);
            } else {
              audio = document.querySelector('[data-sound=tile-swap]');
            }
            if (this.soundIsOn) {
              audio.play();
            }
            this.tilesLi[index] = tileClone;
            tile.remove();
            handler(index);
          });
        }
      }
    });
  }
}
