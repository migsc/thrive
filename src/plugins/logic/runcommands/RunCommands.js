import ArrayCopy from 'plugins/utils/array/Copy.js';
import TypeConvert from 'plugins/utils/string/TypeConvert.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var runCommands = function (queue, scope, config) {
    var reverse = GetValue(config, 'reverse', false);

    var retVal;
    if (typeof (queue[0]) === 'string') {
        retVal = runCommand(queue, scope, config);
    } else {
        if (!reverse) {
            for (var i = 0, len = queue.length; i < len; i++) {
                retVal = runCommands(queue[i], scope, config);
            }
        } else {
            for (var len = queue.length, i = len - 1; i >= 0; i--) {
                retVal = runCommands(queue[i], scope, config);
            }
        }
    }

    return retVal;
}

var runCommand = function (cmd, scope, config) {
    var argsConvert = GetValue(config, 'argsConvert', undefined);
    var argsConvertScope = GetValue(config, 'argsConvertScope', undefined);

    var fnName = cmd[0];

    ARGS = ArrayCopy(ARGS, cmd, 1);
    if (argsConvert) {
        // convert string to floating number, boolean, null, or string        
        if (argsConvert === true) {
            argsConvert = TypeConvert;
            argsConvertScope = undefined;
        }
        for (var i = 0, len = ARGS.length; i < len; i++) {
            if (argsConvertScope) {
                ARGS[i] = argsConvert.call(argsConvertScope, ARGS[i], cmd);
            } else {
                ARGS[i] = argsConvert(ARGS[i], cmd);
            }
        }
    }

    var fn = scope[fnName];
    if (fn == null) {
        fn = GetValue(scope, fnName, null);
    }

    var retValue = fn.apply(scope, ARGS);
    return retValue;
}
var ARGS = []; // reuse this array

export default runCommands;