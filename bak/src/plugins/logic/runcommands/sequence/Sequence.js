import RunCommands from 'plugins/runcommands.js';
import ArrayCopy from 'plugins/utils/array/Copy.js';

const EE = Phaser.Events.EventEmitter;
const GetFastValue = Phaser.Utils.Objects.GetFastValue;

class Sequence extends EE {
    constructor(config) {
        super();

        this.commands = [];
        this.scope = undefined;
        this.config = undefined;
        this.index = 0;
        this.indexStep = 1; // 1, or -1
        this.setYoyo(GetFastValue(config, 'yoyo', false));
        this.setRepeat(GetFastValue(config, 'repeat', 0));
        this.setLoop(GetFastValue(config, 'loop', false));
        this.state = 0; // 0: idle, 1: run, 2: run-last
        this.task = undefined;
    }

    shutdown() {
        super.shutdown();
        this.stop();
        this.commands.length = 0;
        this.scope = undefined;
        this.config = undefined;
    }

    destroy() {
        this.shutdown();
    }
    
    load(commands, scope, config) {
        this.stop();
        this.setYoyo(GetFastValue(config, 'yoyo', this.yoyo));
        this.setRepeat(GetFastValue(config, 'repeat', this.repeat));
        this.setLoop(GetFastValue(config, 'loop', this.loop));

        this.commands = ArrayCopy(this.commands, commands);
        this.scope = scope;
        this.config = config;
        return this;
    }

    start() {
        this.stop();

        this.resetRepeatCount();
        this.index = 0;
        this.indexStep = 1;
        this.state = 1;
        if (this.commands.length > 0) {
            this.runNextCommands();
        } else {
            this.complete();
        }
        return this;
    }

    stop() {
        this.state = 0;
        if (this.task) {
            this.task.off('complete', this.runNextCommands, this);
            this.task = undefined;
        }
        return this;
    }

    setYoyo(m) {
        this.yoyo = m;
        return this;
    }

    setRepeat(count) {
        this.repeat = count;
        this.resetRepeatCount();
        return this;
    }

    setLoop(m) {
        this.loop = m;
        this.resetRepeatCount();
        return this;
    }

    resetRepeatCount() {
        this.repeatCount = (this.repeat === -1 || this.loop) ? 999999999999 : this.repeat;
        return this;
    }

    get completed() {
        return (this.state === 0);
    }

    get currentCommandIndex() {
        return (this.index - 1);
    }

    runNextCommands() {
        var task, isFirstCommand, isLastCommand;
        while (1) {
            if (this.state === 2) {
                this.complete();
                return;
            }

            task = RunCommands(this.commands[this.index], this.scope);
            if (task && (typeof (task.once) === 'function')) {
                task.once('complete', this.runNextCommands, this);
                this.task = task;
            } else {
                this.task = undefined;
            }

            isFirstCommand = (this.index === 0);
            isLastCommand = (this.index === (this.commands.length - 1));
            if (!this.yoyo) {
                if (isLastCommand) {
                    this.index = 0;
                    if (this.repeatCount > 0) {
                        this.repeatCount--;
                    } else {
                        this.state = 2; // goto idle at next running
                    }
                } else {
                    this.index += this.indexStep;
                }
            } else {
                if (((this.indexStep > 0) && isLastCommand) ||
                    ((this.indexStep < 0) && isFirstCommand)) {
                    this.indexStep = -this.indexStep;
                    this.index += this.indexStep;
                    if (this.repeatCount > 0) {
                        this.repeatCount--;
                    } else {
                        this.state = 2; // goto idle at next running
                    }
                } else {
                    this.index += this.indexStep;
                }
            }

            if (this.task) {
                return this;
            }
        }
    }

    complete() {
        this.state = 0;
        this.emit('complete', this);
    }
}

export default Sequence;