import styles from "../styles/Form.module.css";
import { range } from "lodash";
import { createRef } from "react";

export default function Form() {
	return (
		<div className={styles.form} hidden>
			<label className={styles.label} htmlFor="form-name">
				Name:{" "}
			</label>{" "}
			<input
				type="text"
				name="form-name"
				id="form-name"
				placeholder="Your name"
				maxLength={60}
			/>{" "}
			<br />
			<label className={styles.label} htmlFor="form-age">
				Age:{" "}
			</label>{" "}
			<select name="form-age" id="form-age">
				{range(
					Number(process.env.NEXT_PUBLIC_MIN_AGE),
					Number(process.env.NEXT_PUBLIC_MAX_AGE) + 1
				).map((num) => (
					<option value={num.toString()} key={num.toString()}>
						{num.toString()}
					</option>
				))}
			</select>
		</div>
	);
}
