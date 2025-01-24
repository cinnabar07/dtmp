/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/export const description = `
Tests for GPU.requestAdapter.

Test all possible options to requestAdapter.
default, low-power, and high performance should all always return adapters.
forceFallbackAdapter may or may not return an adapter.
invalid featureLevel values should not return an adapter.

GPU.requestAdapter can technically return null for any reason
but we need test functionality so the test requires an adapter except
when forceFallbackAdapter is true.

The test runs simple compute shader is run that fills a buffer with consecutive
values and then checks the result to test the adapter for basic functionality.
`;import { Fixture } from '../../../../common/framework/fixture.js';import { makeTestGroup } from '../../../../common/framework/test_group.js';import { getGPU } from '../../../../common/util/navigator_gpu.js';
import { assert, objectEquals, iterRange } from '../../../../common/util/util.js';

export const g = makeTestGroup(Fixture);

const powerPreferenceModes = [
undefined,
'low-power',
'high-performance'];

const forceFallbackOptions = [undefined, false, true];
const validFeatureLevels = [undefined, 'core', 'compatibility'];
const invalidFeatureLevels = ['cor', 'Core', 'compatability', '', ' '];

async function testAdapter(t, adapter) {
  assert(adapter !== null, 'Failed to get adapter.');
  const device = await t.requestDeviceTracked(adapter);

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
  const buffer = t.trackForCleanup(globalThis._TRAMPOLINE_("createBuffer",
  device, device.createBuffer, [{
    size: kBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  }], () => globalThis._TRAMPOLINE_("createBuffer", device, device.createBuffer, [{ size: kBufferSize, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC }], () => device.createBuffer({ size: kBufferSize, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC })))
  );

  const resultBuffer = t.trackForCleanup(globalThis._TRAMPOLINE_("createBuffer",
  device, device.createBuffer, [{
    size: kBufferSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
  }], () => globalThis._TRAMPOLINE_("createBuffer", device, device.createBuffer, [{ size: kBufferSize, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }], () => device.createBuffer({ size: kBufferSize, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST })))
  );

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

g.test('requestAdapter').
desc(`request adapter with all possible options and check for basic functionality`).
params((u) =>
u.
combine('powerPreference', powerPreferenceModes).
combine('forceFallbackAdapter', forceFallbackOptions)
).
fn(async (t) => {
  const { powerPreference, forceFallbackAdapter } = t.params;
  const adapter = await globalThis._TRAMPOLINE_("requestAdapter", getGPU(t.rec), getGPU(t.rec).requestAdapter, [{
    ...(powerPreference !== undefined && { powerPreference }),
    ...(forceFallbackAdapter !== undefined && { forceFallbackAdapter })
  }], () => getGPU(t.rec).requestAdapter({ ...(powerPreference !== undefined && { powerPreference }), ...(forceFallbackAdapter !== undefined && { forceFallbackAdapter }) }));

  // failing to create an adapter when forceFallbackAdapter is true is ok.
  if (forceFallbackAdapter && !adapter) {
    t.skip('No adapter available');
    return;
  }

  await testAdapter(t, adapter);
});

g.test('requestAdapter_invalid_featureLevel').
desc(`request adapter with invalid featureLevel string values return null`).
params((u) => u.combine('featureLevel', [...validFeatureLevels, ...invalidFeatureLevels])).
fn(async (t) => {
  const { featureLevel } = t.params;
  const adapter = await globalThis._TRAMPOLINE_("requestAdapter", getGPU(t.rec), getGPU(t.rec).requestAdapter, [{ featureLevel }], () => getGPU(t.rec).requestAdapter({ featureLevel }));

  if (!validFeatureLevels.includes(featureLevel)) {
    assert(adapter === null);
  } else {
    await testAdapter(t, adapter);
  }
});

g.test('requestAdapter_no_parameters').
desc(`request adapter with no parameters`).
fn(async (t) => {
  const adapter = await globalThis._TRAMPOLINE_("requestAdapter", getGPU(t.rec), getGPU(t.rec).requestAdapter, [], () => getGPU(t.rec).requestAdapter());
  await testAdapter(t, adapter);
});
//# sourceMappingURL=requestAdapter.spec.js.map