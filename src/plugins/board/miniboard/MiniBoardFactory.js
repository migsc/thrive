import MiniBoard from './MiniBoard.js';
import ObjectFactory from '../ObjectFactory.js';
import SetValue from 'plugins/utils/object/SetValue.js';

ObjectFactory.register('miniBoard', function (x, y, config) {
    return new MiniBoard(this.scene, x, y, config);
});

SetValue(window, 'RexPlugins.Board.MiniBoard', MiniBoard);

export default MiniBoard;