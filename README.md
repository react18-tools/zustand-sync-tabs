# Zustand Sync Tabs [![Version](https://img.shields.io/npm/v/zustand-sync-tabs.svg?colorB=green)](https://www.npmjs.com/package/zustand-sync-tabs) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/dt/zustand-sync-tabs.svg)](https://www.npmjs.com/package/zustand-sync-tabs) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/zustand-sync-tabs)

> Zustand middleware to easily sync Zustand state between tabs/windows / iframes (Same Origin)

- ✅ 🐙 ~ 1 kB size cross-tab state sharing middleware for Zustand
- ✅ Full TypeScript Support
- ✅ solid reliability in 1 writing and n reading tab scenarios (with changing writing tab)
- ✅ Fire and forget approach of always using the latest state. Perfect for single-user systems
- ✅ Sync Zustand state between multiple browsing contexts
- ✅ Partial state sharing is also supported

> Check out `[persist-and-sync](https://github.com/react18-tools/persist-and-sync)` if you are looking for persisting state locally over reload/refresh or after closing the site.

## Install

```bash
$ pnpm add zustand-sync-tabs
```
**or**

```bash
$ npm install zustand-sync-tabs
```
**or**

```bash
$ yarn add zustand-sync-tabs
```

## Usage

Add the middleware while creating the store and the rest will be taken care.

```ts
import { create } from "zustand";
import { syncTabs } from "zustand-sync-tabs";

type MyStore = {
	count: number;
	set: (n: number) => void;
};

const useStore = create<MyStore>(
	syncTabs(
		set => ({
			count: 0,
			set: n => set({ count: n }),
		}),
		{ name: "my-channel" },
	),
);
```

⚡🎉Boom! Just a couple of lines and your state perfectly syncs between tabs/windows and it is also persisted using `localStorage`!

## Advanced - ignore / filter out fields based on regExp

In several cases you might want to exclude several fields from syncing. To support this scenario, we provide a mechanism to exclude fields based on list of fields or regular expression.

```ts
type SyncTabsOptionsType = {
	name: string;
	/** @deprecated */
	regExpToIgnore?: RegExp;
	include?: (string | RegExp)[];
	exclude?: (string | RegExp)[];
};
```

**Example**

```typescript
export const useMyStore = create<MyStoreType>()(
	syncTabs(
		set => ({
			count: 0,
			_count: 0 /** skipped as it is included in exclude array */,
			setCount: count => {
				set(state => ({ ...state, count }));
			},
			set_Count: _count => {
				set(state => ({ ...state, _count }));
			},
		}),
		{ name: "example", exclude: ["_count"] },
	),
);
```

For more details about regExp check out - [JS RegExp](https://www.w3schools.com/jsref/jsref_obj_regexp.asp)

### 🤩 Don't forget to star [this repo](https://github.com/mayank1513/turborepo-template)!

Want hands-on course for getting started with Turborepo? Check out [React and Next.js with TypeScript](https://mayank-chaudhari.vercel.app/courses/react-and-next-js-with-typescript) and [The Game of Chess with Next.js, React and TypeScrypt](https://www.udemy.com/course/game-of-chess-with-nextjs-react-and-typescrypt/?referralCode=851A28F10B254A8523FE)

![Alt](https://repobeats.axiom.co/api/embed/6b5fa6a5fbb6affafea042ba0f292ecf9388ef3c.svg "Repobeats analytics image")

## License

Licensed as MIT open source.

<hr />

<p align="center" style="text-align:center">with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a></p>
