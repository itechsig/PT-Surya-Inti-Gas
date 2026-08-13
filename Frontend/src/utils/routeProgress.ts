type Listener = (loading: boolean) => void;

let loading = false;
const listeners = new Set<Listener>();

export function setRouteLoading(value: boolean) {
  if (loading === value) return;
  loading = value;
  listeners.forEach((listener) => listener(loading));
}

export function subscribeRouteLoading(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRouteLoading() {
  return loading;
}
