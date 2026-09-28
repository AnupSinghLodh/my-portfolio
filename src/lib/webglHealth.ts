type LinkCheckContext = {
  LINK_STATUS: number;
  getProgramParameter: (program: WebGLProgram, pname: number) => unknown;
};

/** ogl only warns when a shader fails to compile or link, so callers must check explicitly. */
export function isProgramLinked(gl: LinkCheckContext, program: WebGLProgram): boolean {
  return gl.getProgramParameter(program, gl.LINK_STATUS) === true;
}

/** Calls `handler` when the browser drops the WebGL context; returns a disposer. */
export function onContextLost(canvas: HTMLCanvasElement, handler: () => void): () => void {
  const listener = (event: Event) => {
    event.preventDefault();
    handler();
  };
  canvas.addEventListener("webglcontextlost", listener);
  return () => canvas.removeEventListener("webglcontextlost", listener);
}
