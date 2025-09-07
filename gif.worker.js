// --- Contenido CORRECTO y LIMPIO para el archivo gif.worker.js ---
var GIFEncoder, renderFrame;

onmessage = function (e) {
  var data = e.data;
  if (data.command === 'init') {
    importScripts(data.encoderURL);
    GIFEncoder = new self.GIFEncoder();
  } else if (data.command === 'frame') {
    if (!renderFrame) {
      renderFrame = function (frame) {
        if (frame.config) {
          GIFEncoder.setProperties(frame.config.repeat, frame.config.delay, frame.config.quality);
        }
        GIFEncoder.addImage(frame.data, frame.config.transparent);
        return GIFEncoder.getParts();
      };
    }
    var parts = renderFrame(data.frame);
    postMessage({
      type: 'frame',
      frameIndex: data.frameIndex,
      parts: parts
    });
  }
};