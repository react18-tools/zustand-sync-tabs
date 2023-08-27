import { create } from "zustand";
import { syncTabs } from "zustand-sync-tabs";

type MyStoreType = {
	count: number;
	_count: number;
	setCount: (c: number) => void;
	setCount2: (c: number) => void;
};

export const useMyStore = create<MyStoreType>()(
	syncTabs(
		set => ({
			count: 0,
			_count: 0 /** skipped as it matches the regexp provided */,
			setCount: count => set(state => ({ ...state, count })),
			setCount2: _count => set(state => ({ ...state, _count })),
		}),
		{ name: "example", regExpToIgnore: /^_/ },
	),
);
