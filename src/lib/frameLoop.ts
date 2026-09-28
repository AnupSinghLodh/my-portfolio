export type FrameLoop = {
  setVisible: (visible: boolean) => void;
  destroy: () => void;
};

type Options = { reducedMotion: boolean };

export function createFrameLoop(
  render: (timeMs: number) => void,
  { reducedMotion }: Options,
  raf: (callback: FrameRequestCallback) => number = (callback) => window.requestAnimationFrame(callback),
  caf: (id: number) => void = (id) => window.cancelAnimationFrame(id)
): FrameLoop {
  let frameId: number | null = null;
  let destroyed = false;

  if (reducedMotion) {
    render(0);
    return {
      setVisible: () => {},
      destroy: () => {
        destroyed = true;
      },
    };
  }

  const tick = (time: number) => {
    render(time);
    frameId = raf(tick);
  };

  const start = () => {
    if (frameId === null && !destroyed) frameId = raf(tick);
  };

  const stop = () => {
    if (frameId !== null) {
      caf(frameId);
      frameId = null;
    }
  };

  start();

  return {
    setVisible: (visible) => (visible ? start() : stop()),
    destroy: () => {
      stop();
      destroyed = true;
    },
  };
}
