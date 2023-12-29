import { create } from "../vitest.setup";
import { syncTabs } from "../src";

type MyStoreType = {
	count: number;
	_count: number;
	setCount: (c: number) => void;
	set_Count: (c: number) => void;
};

export const useMyStore = create<MyStoreType>(
	syncTabs(
		set => ({
			count: 0,
			_count: 0 /** skipped as it matches the regexp provided */,
			setCount: count => set(state => ({ ...state, count })),
			set_Count: _count => set(state => ({ ...state, _count })),
		}),
		{ name: "example", exclude: [/^_/] },
	),
);

export const useCookieStore = create<MyStoreType>(
	syncTabs(
		set => ({
			count: 0,
			_count: 0 /** skipped as it matches the regexp provided */,
			setCount: count => set(state => ({ ...state, count })),
			set_Count: _count => set(state => ({ ...state, _count })),
		}),
		{ name: "example", include: [/count/], exclude: [/^_/] },
	),
);
