import TickTask from 'plugins/utils/ticktask/TickTask.js';
import GetSceneObject from 'plugins/utils/system/GetSceneObject.js';

const GetValue = Phaser.Utils.Objects.GetValue;

class Clock extends TickTask {
    constructor(parent, config) {
        super(parent, config);

        this.parent = parent;
        this.scene = GetSceneObject(parent);
        this.resetFromJSON(config);
        this.boot();
    }

    resetFromJSON(o) {
        this.isRunning = GetValue(o, 'isRunning', false);
        this.timeScale = GetValue(o, 'timeScale', 1);
        this.now = GetValue(o, 'now', 0);        
        return this;
    }

    toJSON() {
        return {
            isRunning: this.isRunning,
            timeScale: this.timeScale,
            now: this.now,            
            tickingMode: this.tickingMode
        };
    }

    boot() {
        super.boot();

        if (this.parent.on) {
            this.parent.on('destroy', this.destroy, this);
        }
    }

    shutdown() {
        super.shutdown();
        this.parent = undefined;
        this.scene = undefined;
    }

    destroy() {
        this.shutdown();
    }

    startTicking() {
        super.startTicking();
        this.scene.events.on('update', this.update, this);
    }

    stopTicking() {
        super.stopTicking();
        this.scene.events.off('update', this.update, this);
    }

    start(startAt) {
        if (startAt === undefined) {
            startAt = 0;
        }
        this.now = startAt;
        super.start();
        return this;
    }

    seek(time) {
        this.now = time;
        return this;
    }

    update(time, delta) {
        if ((!this.isRunning) || (this.timeScale === 0)) {
            return this;
        }
        this.now += (delta * this.timeScale);
        return this;
    }
}

export default Clock;