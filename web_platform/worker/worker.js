/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/import { getGPU, setDefaultRequestAdapterOptions } from '../../../common/util/navigator_gpu.js';import { assert, objectEquals, iterRange } from '../../../common/util/util.js'; // Should be WorkerGlobalScope, but importing lib "webworker" conflicts with lib "dom".


async function basicTest() {
  const adapter = await globalThis._TRAMPOLINE_("requestAdapter", getGPU(null), getGPU(null).requestAdapter, [], () => getGPU(null).requestAdapter());
  assert(adapter !== null, 'Failed to get adapter.');


  const device = await globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => globalThis._TRAMPOLINE_("requestDevice", adapter, adapter.requestDevice, [], () => adapter.requestDevice()));
  assert(device !== null, 'Failed to get device.');

  const kOffset = 1230000;
  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        code: `
          struct Buffer { data: array<u32>, };

          @group(0) @binding(0) var<storage, read_write> buffer: Buffer;
          @compute @workgroup_size(1u) fn main(
              @builtin(global_invocation_id) id: vec3<u32>) {
            buffer.data[id.x] = id.x + ${kOffset}u;
          }
        `
      }),
      entryPoint: 'main'
    }
  });

  const kNumElements = 64;
  const kBufferSize = kNumElements * 4;

  const buffer = globalThis._TRAMPOLINE_("createBuffer", device, device.createBuffer, [{
    size: kBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  }], () => globalThis._TRAMPOLINE_("createBuffer", device, device.createBuffer, [{ size: kBufferSize, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }], () => device.createBuffer({ size: kBufferSize, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC })));


  const resultBuffer = globalThis._TRAMPOLINE_("createBuffer", device, device.createBuffer, [{
    size: kBufferSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
  }], () => globalThis._TRAMPOLINE_("createBuffer", device, device.createBuffer, [{ size: kBufferSize, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }], () => device.createBuffer({ size: kBufferSize, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST })));

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer } }]
  });

  const encoder = globalThis._TRAMPOLINE_("createCommandEncoder", device, device.createCommandEncoder, [], () => globalThis._TRAMPOLINE_("createCommandEncoder", device, device.createCommandEncoder, [], () => device.createCommandEncoder()));

  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(kNumElements);
  pass.end();

  encoder.copyBufferToBuffer(buffer, 0, resultBuffer, 0, kBufferSize);

  globalThis._TRAMPOLINE_("submit", device, device.queue.submit, [[encoder.finish()]], () => globalThis._TRAMPOLINE_("submit", device, device.queue.submit, [[encoder.finish()]], () => device.queue.submit([encoder.finish()])));

  const expected = new Uint32Array([...iterRange(kNumElements, (x) => x + kOffset)]);

  await globalThis._TRAMPOLINE_("mapAsync", resultBuffer, resultBuffer.mapAsync, [GPUMapMode.READ], () => globalThis._TRAMPOLINE_("mapAsync", resultBuffer, resultBuffer.mapAsync, [GPUMapMode.READ], () => resultBuffer.mapAsync(GPUMapMode.READ)));
  const actual = new Uint32Array(resultBuffer.getMappedRange());

  assert(objectEquals(actual, expected), 'compute pipeline ran');

  globalThis._TRAMPOLINE_("destroy", resultBuffer, resultBuffer.destroy, [], () => globalThis._TRAMPOLINE_("destroy", resultBuffer, resultBuffer.destroy, [], () => resultBuffer.destroy()));
  globalThis._TRAMPOLINE_("destroy", buffer, buffer.destroy, [], () => globalThis._TRAMPOLINE_("destroy", buffer, buffer.destroy, [], () => buffer.destroy()));
  globalThis._TRAMPOLINE_("destroy", device, device.destroy, [], () => globalThis._TRAMPOLINE_("destroy", device, device.destroy, [], () => device.destroy()));
}

async function reportTestResults(ev) {
  const defaultRequestAdapterOptions =
  ev.data.defaultRequestAdapterOptions;
  setDefaultRequestAdapterOptions(defaultRequestAdapterOptions);

  let error = undefined;
  try {
    await basicTest();
  } catch (err) {
    error = err.toString();
  }
  this.postMessage({ error });
}

self.onmessage = (ev) => {
  void reportTestResults.call(ev.source || self, ev);
};

self.onconnect = (event) => {
  const port = event.ports[0];

  port.onmessage = (ev) => {
    void reportTestResults.call(port, ev);
  };
};
//# sourceMappingURL=worker.js.map