import { StateCreator } from "zustand";

export type SyncTabsOptionsType = { name: string; regExpToIgnore?: RegExp };
type SyncTabsType = <T>(f: StateCreator<T, [], []>, options: SyncTabsOptionsType) => StateCreator<T, [], []>;

export const syncTabs: SyncTabsType = (f, options) => (set, get, store) => {
  /** avoid errors on server side or when BroadcastChannel is not supported */
  if (!globalThis.BroadcastChannel) {
    console.log("BroadcastChannel is not supported in this context!");
    return f(set, get, store);
  }

  const channel = new BroadcastChannel(options.name);

  const set_: typeof set = (...args) => {
    const prevState = get() as { [k: string]: any };
    set(...args);
    const currentState = get() as { [k: string]: any };
    const stateUpdates: { [k: string]: any } = {};
    /** sync only updated state to avoid un-necessary re-renders */
    Object.keys(currentState).forEach(k => {
      if (!options.regExpToIgnore?.test(k) && currentState[k] !== prevState[k]) {
        stateUpdates[k] = currentState[k];
      }
    });
    if (Object.keys(stateUpdates).length) {
      channel?.postMessage(stateUpdates);
    }
  };

  if (channel) {
    channel.onmessage = e => {
      set(e.data);
    };
  }
  return f(set_, get, store);
};
