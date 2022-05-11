import { Session } from "next-auth";
import { MouseEventHandler } from "react";
import styles from "../styles/Login.module.css"
export default function Login(props: {login: MouseEventHandler}) {
	return (
        <div className={styles.signin}>
            <h1>Login in with Discord</h1>
            <br />
			<input
				type="button"
				className={styles.button}
				value=""
                name="discord-sign-in"
                onClick={props.login}
			/>
		</div>
	);
}
