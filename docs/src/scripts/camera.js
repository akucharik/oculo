'use strict';

/* exported camera */

const camera = new Oculo.Camera({
    dragToMove: true,
    minZoom: 0.40,
    wheelToZoom: true
});

export default camera;