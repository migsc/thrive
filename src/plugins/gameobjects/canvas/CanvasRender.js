import WebGLRenderer from './CanvasWebGLRenderer.js';
import CanvasRenderer from './CanvasCanvasRenderer.js';
import NOOP from 'plugins/utils/object/NOOP.js';

var renderWebGL = NOOP;
var renderCanvas = NOOP;

if (WEBGL_RENDERER) {
    renderWebGL = WebGLRenderer;
}

if (CANVAS_RENDERER) {
    renderCanvas = CanvasRenderer;
}

export default {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};