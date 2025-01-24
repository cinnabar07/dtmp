/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
* @fileoverview
* Tests for zero or extremely large buffer/texture dimensions.
* - Zero-length buffers
* - Very large buffers (near or exceeding device limits)
* - Zero-size textures
* - Very large textures (near or exceeding device limits)
*/import { makeTestGroup } from '../../common/framework/test_group.js';import { GPUTest } from '../gpu_test.js';
export const description = `
Validation and usage tests for buffer/texture dimension extremes (e.g. zero-sized or very large).
`;

export const g = makeTestGroup(GPUTest);

/**
 * Utility to obtain a buffer size near the device's limits.
 * There's no formal "maxBufferSize" in the spec, but we can attempt something near
 * the maximum safe integer or the largest safe usage that won't exceed GPU requirements.
 *
 * In practice, `maxBufferSize` is limited by the device's memory and resource constraints.
 * For conformance, we can pick some "very large" number below JS's safe integer limit
 * or below the device's reported memory limit, if any.
 *
 * This example picks 128 MB for demonstration, which is "large" enough to test interesting edge
 * cases, but small enough to typically not exhaust GPU memory in a normal environment.
 * Adjust as needed.
 */
function getVeryLargeBufferSize() {
  // 128MB as an example "large" buffer for testing
  return 128 * 1024 * 1024;
}

g.test('buffer,zero_size').
desc(
  `
Tests creating a buffer with size=0. This is allowed by the spec
and should succeed (the buffer is just an empty resource).
`
).
fn((t) => {
  // Try different usage flags to ensure it doesn't matter for zero-size buffers.
  const usageFlagsList = [
  GPUBufferUsage.MAP_READ,
  GPUBufferUsage.MAP_WRITE,
  GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
  GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST];


  for (const usage of usageFlagsList) {
    const descriptor = {
      size: 0,
      usage
    };

    // Validation: This should succeed in creation. There's no rule disallowing size=0.
    t.expectValidationError(() => {
      globalThis._TRAMPOLINE_("createBuffer", t.device, t.device.createBuffer, [descriptor], () => globalThis._TRAMPOLINE_("createBuffer", t.device, t.device.createBuffer, [descriptor], () => t.device.createBuffer(descriptor)));
    }, false /* shouldError */);
  }
});

g.test('buffer,very_large_size').
desc(
  `
Tests creating a "very large" buffer (128MB or so). In real usage,
this might be near or over some device resource limit. The test must
accept either:
- creation success, or
- a valid error (if the adapter can't allocate that much).
`
).
params((u) =>
u.combineWithParams([
{ usage: GPUBufferUsage.MAP_WRITE },
{ usage: GPUBufferUsage.COPY_DST },
{ usage: GPUBufferUsage.STORAGE },
{ usage: GPUBufferUsage.STORAGE | GPUBufferUsage.MAP_WRITE }]
)
).
fn((t) => {
  const { usage } = t.params;
  const size = getVeryLargeBufferSize();

  // We expect that this might fail to allocate, so if it fails, it should be an OOM error,
  // or it might pass. In that sense, either is legal per spec. We'll rely on .shouldThrow
  // to catch if it fails for reasons other than out-of-memory or validation.
  t.device.pushErrorScope('out-of-memory');
  const buffer = globalThis._TRAMPOLINE_("createBuffer", t.device, t.device.createBuffer, [{
    size,
    usage
  }], () => globalThis._TRAMPOLINE_("createBuffer", t.device, t.device.createBuffer, [{ size, usage }], () => t.device.createBuffer({ size, usage })));
  const popPromise = t.device.popErrorScope();

  t.eventualAsyncExpectation(async (niceStack) => {
    const error = await popPromise;
    // If error is non-null, we expect OOM. Validation error would not be correct here
    // but let's gracefully handle it anyway:
    if (error && !(error instanceof GPUOutOfMemoryError)) {
      niceStack.message = `Expected out-of-memory, got: ${error}`;
      t.rec.validationFailed(niceStack);
    } else {
      // else success or OOM is fine
      if (!error) {
        // Buffer created successfully. Just do a trivial usage to ensure it doesn't fail.
        // e.g. queue a no-op copy of 0 bytes:
        const commandEncoder = globalThis._TRAMPOLINE_("createCommandEncoder", t.device, t.device.createCommandEncoder, [], () => globalThis._TRAMPOLINE_("createCommandEncoder", t.device, t.device.createCommandEncoder, [], () => t.device.createCommandEncoder()));
        commandEncoder.copyBufferToBuffer(buffer, 0, buffer, 0, 0);
        globalThis._TRAMPOLINE_("submit", t.device, t.device.queue.submit, [[commandEncoder.finish()]], () => globalThis._TRAMPOLINE_("submit", t.device, t.device.queue.submit, [[commandEncoder.finish()]], () => t.device.queue.submit([commandEncoder.finish()])));
      }
    }
  });
});

g.test('texture,zero_size').
desc(
  `
Tests creating a 2D texture with one or more zero dimensions (width=0 or height=0).
Creating a texture with a zero dimension is disallowed by the spec, so we expect
a validation error in each case.
`
).
params((u) =>
u.
combineWithParams([
{ dimension: '2d', width: 0, height: 16 },
{ dimension: '2d', width: 16, height: 0 },
{ dimension: '2d', width: 0, height: 0 }]
)
// Try a few example usage flags that are likely to be used
.combine('usage', [
GPUTextureUsage.TEXTURE_BINDING,
GPUTextureUsage.RENDER_ATTACHMENT,
GPUTextureUsage.STORAGE_BINDING]
)
).
fn((t) => {
  const { dimension, width, height, usage } = t.params;
  t.expectValidationError(() => {
    t.device.createTexture({
      dimension,
      size: [width, height, 1],
      format: 'rgba8unorm',
      usage
    });
  }, true);
});

/**
 * Try to get a "max" texture dimension for a 2D texture, from adapter limits.
 * For demonstration, if the adapter claims e.g. 16384 as maxTextureDimension2D,
 * we use that for a "very large" dimension test. We also test dimension + 1 to
 * confirm it fails validation.
 */
function getMaxTextureDimension2D(t) {
  // The spec says 'maxTextureDimension2D' is guaranteed to be at least 8192 in core. But
  // let's ask the actual device for the real limit at runtime, so we can test near it.
  return t.device.limits.maxTextureDimension2D;
}

g.test('texture,very_large_size').
desc(
  `
Test creating a texture with dimension near the device limit. We test:
- exactly at the limit: this should succeed
- one above the limit: should fail
`
).
params((u) =>
u.
beginSubcases().
combine('exceed', [false, true]).
combine('usage', [
GPUTextureUsage.TEXTURE_BINDING,
GPUTextureUsage.RENDER_ATTACHMENT,
GPUTextureUsage.STORAGE_BINDING]
)
).
fn((t) => {
  const { exceed, usage } = t.params;
  // We'll test a 2D texture for simplicity. One dimension large, the other normal:
  const limit = getMaxTextureDimension2D(t);
  const dimensionToCreate = exceed ? limit + 1 : limit;
  const desc = {
    size: [dimensionToCreate, 2, 1],
    format: 'rgba8unorm',
    usage
  };

  // If exceed=false, we expect no validation error.
  // If exceed=true, we expect a validation error.
  const shouldError = exceed;

  t.expectValidationError(() => {
    t.device.createTexture(desc);
  }, shouldError);
});
//# sourceMappingURL=dimensions.spec.js.map