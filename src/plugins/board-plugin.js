import ObjectFactory from './board/ObjectFactory.js';
import HexagonMap from './board/hexagonmap/index.js';

class BoardPlugin extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        super(scene, pluginManager);

        this.add = new ObjectFactory(scene);

        // Helper functions
        this.hexagonMap = HexagonMap;
    }        
}

export default BoardPlugin;