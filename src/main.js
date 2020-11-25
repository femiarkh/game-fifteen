import Model from './models/model';
import View from './views/view';
import Controller from './controllers/controller';

const gameSize = 4;
const game = new Controller(new Model(gameSize), new View(gameSize));
game.init();
