import { StateCreator } from "zustand";
export type SyncTabsOptionsType = {
    name: string;
    regExpToIgnore?: RegExp;
};
type SyncTabsType = <T>(f: StateCreator<T, [], []>, options: SyncTabsOptionsType) => StateCreator<T, [], []>;
export declare const syncTabs: SyncTabsType;
export {};
