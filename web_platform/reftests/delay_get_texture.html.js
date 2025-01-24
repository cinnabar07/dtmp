/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/import { timeout } from '../../../common/util/timeout.js';import { takeScreenshotDelayed } from '../../../common/util/wpt_reftest_wait.js';function assert(condition, msg) {if (!condition) {
    throw new Error(msg && (typeof msg === 'string' ? msg : msg()));
  }
}

void (async () => {
  assert(
    typeof navigator !== 'undefined' && navigator.gpu !== undefined,
    'No WebGPU implementation found'
  );

  const adapter = await globalThis._TRAMPOLINE_("requestAdapter", navigator.gpu, navigator.gpu.requestAdapter, [], () => navigator.gpu.requestAdapter());
  assert(adapter !== null);
  const device = await globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => adapter.requestDevice()));
  assert(device !== null);

  const canvas = document.getElementById('cvs0');
  const ctx = canvas.getContext('webgpu');
  ctx.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'premultiplied'
  });

  timeout(() => {
    const encoder = globalThis._TRAMPOLINE_("createCommandEncoder", device, device.createCommandEncoder, [], () => globalThis._TRAMPOLINE_("createCommandEncoder", device, device.createCommandEncoder, [], () => device.createCommandEncoder()));
    const pass = encoder.beginRenderPass({
      colorAttachments: [
      {
        view: ctx.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 1.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store'
      }]

    });
    pass.end();
    globalThis._TRAMPOLINE_("submit", device, device.queue.submit, [[encoder.finish()]], () => globalThis._TRAMPOLINE_("submit", device, device.queue.submit, [[encoder.finish()]], () => device.queue.submit([encoder.finish()])));

    takeScreenshotDelayed(50);
  }, 100);
})();
//# sourceMappingURL=delay_get_texture.html.js.map