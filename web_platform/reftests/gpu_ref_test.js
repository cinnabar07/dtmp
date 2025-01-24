/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/import { assert } from '../../../common/util/util.js';import { takeScreenshot, takeScreenshotDelayed } from '../../../common/util/wpt_reftest_wait.js';



export function runRefTest(fn) {
  void (async () => {
    assert(
      typeof navigator !== 'undefined' && navigator.gpu !== undefined,
      'No WebGPU implementation found'
    );

    const adapter = await globalThis._TRAMPOLINE_("requestAdapter", navigator.gpu, navigator.gpu.requestAdapter, [], () => navigator.gpu.requestAdapter());
    assert(adapter !== null);
    const device = await globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => adapter.requestDevice()));
    assert(device !== null);
    const queue = device.queue;

    await fn({ device, queue });

    takeScreenshotDelayed(50);
  })().catch(() => {
    // remove reftest-wait to mark end of test
    takeScreenshot();
  });
}
//# sourceMappingURL=gpu_ref_test.js.map