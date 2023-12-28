import { StateCreator } from "zustand";

export type SyncTabsOptionsType = {
	name: string;
	/** @deprecated */
	regExpToIgnore?: RegExp;
	include?: (string | RegExp)[];
	exclude?: (string | RegExp)[];
};
type SyncTabsType = <T>(
	f: StateCreator<T, [], []>,
	options: SyncTabsOptionsType,
) => StateCreator<T, [], []>;

const LOAD = "__load__";

export const syncTabs: SyncTabsType = (f, options) => (set, get, store) => {
	/** avoid errors on server side or when BroadcastChannel is not supported */
	if (!globalThis.BroadcastChannel) {
		console.log("BroadcastChannel is not supported in this context!");
		return f(set, get, store);
	}

	/** temporarily support `regExpToIgnore` */
	if (!options.exclude) options.exclude = [];
	if (options.regExpToIgnore) options.exclude.push(options.regExpToIgnore);
	/** end of temporarily support `regExpToIgnore` */

	const channel = new BroadcastChannel(options.name);

	if (channel) channel.postMessage(LOAD);

	const set_: typeof set = (...args) => {
		const prevState = get() as { [k: string]: any };
		set(...args);
		const currentState = get() as { [k: string]: any };
		const stateUpdates: { [k: string]: any } = {};
		/** sync only updated state to avoid un-necessary re-renders */
		const keysToSync = getKeysToSyncMemoised(Object.keys(currentState), options);
		if (keysToSync.length === 0) return;

		keysToSync.forEach(k => {
			if (currentState[k] !== prevState[k]) stateUpdates[k] = currentState[k];
		});

		if (Object.keys(stateUpdates).length) {
			channel?.postMessage(stateUpdates);
		}
	};

	if (channel)
		channel.onmessage = e => {
			if (e.data === LOAD) {
				const currentState = get() as { [k: string]: any };
				const stateUpdates: { [k: string]: any } = {};
				/** sync only updated state to avoid un-necessary re-renders */
				const keysToSync = getKeysToSyncMemoised(Object.keys(currentState), options);
				if (keysToSync.length === 0) return;
				keysToSync.forEach(k => {
					if (typeof currentState[k] !== "function") {
						stateUpdates[k] = currentState[k];
					}
				});
				if (Object.keys(stateUpdates).length) {
					channel?.postMessage(stateUpdates);
				}
			} else set(e.data);
		};
	return f(set_, get, store);
};

function matchPatternOrKey(key: string, patterns: (string | RegExp)[]) {
	for (const patternOrKey of patterns) {
		if (typeof patternOrKey === "string" && key === patternOrKey) return true;
		else if (patternOrKey instanceof RegExp && patternOrKey.test(key)) return true;
	}
	return false;
}

/** Encapsulate cache in closure */
const getKeysToSyncMemoised = (() => {
	const persistAndSyncKeysCache: { [k: string]: string[] } = {};

	const getKeysSync = (keys: string[], options: SyncTabsOptionsType) => {
		const { exclude, include } = options;

		const keysToInlcude = include?.length
			? keys.filter(key => matchPatternOrKey(key, include))
			: keys;

		const keysToPersistAndSync = keysToInlcude.filter(
			key => !matchPatternOrKey(key, exclude || []),
		);
		return keysToPersistAndSync;
	};

	return (keys: string[], options: SyncTabsOptionsType) => {
		const cacheKey = JSON.stringify({ options, keys });
		if (!persistAndSyncKeysCache[cacheKey])
			persistAndSyncKeysCache[cacheKey] = getKeysSync(keys, options);
		return persistAndSyncKeysCache[cacheKey];
	};
})();
