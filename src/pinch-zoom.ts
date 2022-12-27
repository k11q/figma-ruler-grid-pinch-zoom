import {store} from "./store"

export function usePinchZoom(event: WheelEvent) {
  event.stopImmediatePropagation();

  if (
    event.deltaX === 0 &&
    event.ctrlKey &&
    store.scale >= 0.02 &&
    store.scale <= 256
  ) {
    let xs = (event.clientX - store.offsetLeft) / store.scale;
    let ys = (event.clientY - store.offsetTop) / store.scale;
    store.scale += event.deltaY * -0.008 * store.scale;
    store.scale = Math.max(0.02, Math.min(256, store.scale));
    store.offsetLeft = event.clientX - xs * store.scale;
    store.offsetTop = event.clientY - ys * store.scale;
  } else {
    store.offsetLeft += -event.deltaX * 0.5;
    store.offsetTop += -event.deltaY * 0.5;
  }
}
