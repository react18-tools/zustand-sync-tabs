"use client";
import { useMyStore } from "../store";
import styles from "./page.module.css";

export default function NotSyncedCounter() {
	const [_count, setCount2] = useMyStore(state => [state._count, state.setCount2]);
	return (
		<div className={styles.card}>
			<h2>Not Synced Counter:</h2>
			<button
				onClick={() => {
					setCount2(_count + 1);
				}}
				type="button">
				🖤 {_count}
			</button>
		</div>
	);
}
