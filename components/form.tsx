import styles from "../styles/Form.module.css";
import { range } from "lodash";
import { createRef, useState } from "react";
import { Session } from "next-auth";
import { GenderList } from "../utils/constants";
import { Applicant } from "@prisma/client";

export default function Form(props: { session: Session }) {
	const user = props.session;
	const [existsState, setExistsState] = useState(false);
	const [initialFetchState, setInitialFetchState] = useState(-1);
	if (initialFetchState == -1) {
		setInitialFetchState(0);
		fetch(`api/db/userExists?id=${user.id}&password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`)
			.then((res) => res.json())
			.then((val) => {
				setInitialFetchState(1);
				if (val) {
					setExistsState(false);
				}
			});
	}
	return (
		<div>
			{initialFetchState < 1 ? (
				<div className={styles.loading}>Connecting...</div>
			) : (
				<div className={styles.form}>
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
			)}
		</div>
	);
}
