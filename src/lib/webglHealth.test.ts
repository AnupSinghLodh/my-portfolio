import { describe, expect, it, vi } from "vitest";
import { isProgramLinked, onContextLost } from "./webglHealth";

describe("isProgramLinked", () => {
  const program = {} as WebGLProgram;

  it("is false when the shader program failed to link", () => {
    const gl = { LINK_STATUS: 0x8b82, getProgramParameter: vi.fn(() => false) };
    expect(isProgramLinked(gl, program)).toBe(false);
    expect(gl.getProgramParameter).toHaveBeenCalledWith(program, 0x8b82);
  });

  it("is true when the shader program linked", () => {
    expect(isProgramLinked({ LINK_STATUS: 0x8b82, getProgramParameter: () => true }, program)).toBe(true);
  });
});

describe("onContextLost", () => {
  it("calls the handler when the browser drops the WebGL context, until disposed", () => {
    const canvas = document.createElement("canvas");
    const handler = vi.fn();
    const dispose = onContextLost(canvas, handler);

    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    dispose();
    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
