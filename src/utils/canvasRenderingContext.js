/**
 * CanvasRenderingContext2D objects with will read frequently equal to "true" tell the user agent that the webpage is likely to perform many read back operations and that it is advantageous to use a software canvas.
 * @type {HTMLCanvasElement}
 */

export  function canvasGetImageData(canvas) {
    return canvas.getContext("2d", {willReadFrequently: true});
}

