/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/import { timeout } from '../../../common/util/timeout.js';import { assert } from '../../../common/util/util.js';import { takeScreenshotDelayed } from '../../../common/util/wpt_reftest_wait.js';void (async () => {
  assert(
    typeof navigator !== 'undefined' && navigator.gpu !== undefined,
    'No WebGPU implementation found'
  );

  const adapter = await globalThis._TRAMPOLINE_("requestAdapter", navigator.gpu, navigator.gpu.requestAdapter, [], () => navigator.gpu.requestAdapter());
  assert(adapter !== null);
  const device = await globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => adapter.requestDevice()));
  assert(device !== null);
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  let deviceLost = false;

  function draw(canvasId, alphaMode, abortAfterDeviceLost) {
    if (deviceLost && abortAfterDeviceLost) {
      return;
    }

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('webgpu');
    ctx.configure({
      device,
      format: presentationFormat,
      alphaMode
    });

    const colorAttachment = ctx.getCurrentTexture();
    const colorAttachmentView = colorAttachment.createView();

    const encoder = globalThis._TRAMPOLINE_("createCommandEncoder", device, device.createCommandEncoder, [], () => globalThis._TRAMPOLINE_("createCommandEncoder", device, device.createCommandEncoder, [], () => device.createCommandEncoder()));
    const pass = encoder.beginRenderPass({
      colorAttachments: [
      {
        view: colorAttachmentView,
        clearValue: { r: 0.4, g: 1.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store'
      }]

    });
    pass.end();
    globalThis._TRAMPOLINE_("submit", device, device.queue.submit, [[encoder.finish()]], () => globalThis._TRAMPOLINE_("submit", device, device.queue.submit, [[encoder.finish()]], () => device.queue.submit([encoder.finish()])));
  }

  function drawAll() {
    draw('cvs0', 'opaque', true);
    draw('cvs1', 'opaque', false);
    draw('cvs2', 'premultiplied', true);
    draw('cvs3', 'premultiplied', false);

    if (!deviceLost) {
      globalThis._TRAMPOLINE_("destroy", device, device.destroy, [], () => globalThis._TRAMPOLINE_("destroy", device, device.destroy, [], () => device.destroy()));
      deviceLost = true;
      timeout(drawAll, 100);
    } else {
      takeScreenshotDelayed(50);
    }
  }

  drawAll();
})();
//# sourceMappingURL=canvas_display_after_device_lost.html.js.map