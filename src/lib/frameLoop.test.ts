import { describe, expect, it, vi } from "vitest";
import { createFrameLoop } from "./frameLoop";

function fakeScheduler() {
  let nextId = 1;
  const queue = new Map<number, FrameRequestCallback>();
  return {
    raf: (callback: FrameRequestCallback) => {
      const id = nextId++;
      queue.set(id, callback);
      return id;
    },
    caf: (id: number) => {
      queue.delete(id);
    },
    flush: (time: number) => {
      const callbacks = [...queue.values()];
      queue.clear();
      callbacks.forEach((callback) => callback(time));
    },
    pending: () => queue.size,
  };
}

describe("createFrameLoop", () => {
  it("renders on every frame while visible", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    createFrameLoop(render, { reducedMotion: false }, scheduler.raf, scheduler.caf);

    scheduler.flush(16);
    scheduler.flush(32);

    expect(render.mock.calls).toEqual([[16], [32]]);
    expect(scheduler.pending()).toBe(1);
  });

  it("renders a single frame at time 0 and never schedules under reduced motion", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    const loop = createFrameLoop(render, { reducedMotion: true }, scheduler.raf, scheduler.caf);

    loop.setVisible(true);

    expect(render.mock.calls).toEqual([[0]]);
    expect(scheduler.pending()).toBe(0);
  });

  it("stops when hidden and resumes once when shown again", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    const loop = createFrameLoop(render, { reducedMotion: false }, scheduler.raf, scheduler.caf);

    loop.setVisible(false);
    expect(scheduler.pending()).toBe(0);

    loop.setVisible(true);
    loop.setVisible(true);
    expect(scheduler.pending()).toBe(1);
  });

  it("cancels the pending frame on destroy and ignores later visibility changes", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    const loop = createFrameLoop(render, { reducedMotion: false }, scheduler.raf, scheduler.caf);

    loop.destroy();
    loop.setVisible(true);
    scheduler.flush(16);

    expect(scheduler.pending()).toBe(0);
    expect(render).not.toHaveBeenCalled();
  });
});
