import styles from "../styles/Form.module.css";
import { Dictionary, range, update } from "lodash";
import {
	ChangeEvent,
	ChangeEventHandler,
	createRef,
	RefObject,
	useState,
} from "react";
import { Session } from "next-auth";
import { GenderList } from "../utils/constants";
import { Applicant } from "@prisma/client";
import { fetcher } from "../utils/tools";
import useSWR from "swr";
import { userInfo } from "os";

function ShortAnswer(props: {
	label: string;
	placeholder: string;
	name: string;
	maxLength: number;
	initVal: string;
	update: Function;
}) {
	return (
		<div>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			{": "}
			<input
				type="text"
				name={props.name}
				id={props.name}
				placeholder={props.placeholder}
				maxLength={props.maxLength}
				className={styles.textInput}
				onChange={function (event) {
					props.update(event.target.value);
				}}
			/>
		</div>
	);
}

function SelectAnswer(props: {
	label: string;
	name: string;
	update: Function;
	choices: Array<any>;
}) {
	return (
		<div>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			{": "}
			<select
				name={props.name}
				id={props.name}
				className={styles.selectInput}
				onChange={function (event) {
					props.update(event.target.value);
				}}
			>
				{props.choices.map((choice) => (
					<option value={choice} key={choice}>
						{choice}
					</option>
				))}
			</select>
		</div>
	);
}

function OpenEndedQuestion(props: {
	label: string;
	name: string;
	update: Function;
}) {
	return (
		<div>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			{": "}
			<textarea
				name={props.name}
				id={props.name}
			></textarea>
		</div>
	);
}

function MultipleSelectAnswer(props: {
	label: string;
	name: string;
	update: Function;
	choices: Array<string>;
}) {
	const checkedDict: Dictionary<boolean> = {};
	return (
		<div>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			<br />
			{range(0, props.choices.length).map((val: number) => {
				checkedDict[props.choices[val]] = false;
				return (
					<span key={val} className={styles.choiceSelect}>
						<input
							className="checkbox"
							type="checkbox"
							name={props.choices[val]}
							id={props.name + val + props.choices[val]}
							onChange={function (event) {
								checkedDict[event.target.name] =
									event.target.checked;
								const returnArray = [];
								for (const item in checkedDict) {
									if (checkedDict[item])
										returnArray.push(item);
								}
								props.update(returnArray.join(" "));
							}}
						/>
						<label htmlFor={props.name + val + props.choices[val]}>
							{props.choices[val]}
						</label>
					</span>
				);
			})}
		</div>
	);
}

export default function Form(props: { session: Session }) {
	const user = props.session;
	const { data, error } = useSWR(
		`/api/db/getUser?id=${user.id}&password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
		fetcher
	);
	const dbData: Applicant = data as Applicant;
	const submitData: Applicant = {
		aboutYou: null,
		age: null,
		datePoly: null,
		gender: GenderList[0],
		hobbies: null,
		id: user.id,
		idealDesc: null,
		name: null,
		poly: null,
		preferredAges: null,
		preferredGenders: null,
		preferredTimeZones: null,
		username: user.username + "#" + user.discriminator,
		timeZone: null,
		profile: user.avatar_url,
	};
	if (error) return <div className={styles.loading}>Load Failed.</div>;
	if (data == null) return <div className={styles.loading}>Loading...</div>;
	return (
		<div>
			<div className={styles.form}>
				<ShortAnswer
					label="Name"
					placeholder="Your name"
					maxLength={100}
					name="form-name"
					initVal={dbData.name}
					update={(val: string) => {
						submitData.name = val;
					}}
				/>
				<SelectAnswer
					name="form-age"
					label="Age"
					choices={range(
						Number(process.env.NEXT_PUBLIC_MIN_AGE),
						Number(process.env.NEXT_PUBLIC_MAX_AGE) + 1
					).map((item) => item.toString())}
					update={(val: string) => {
						submitData.age = Number(val);
					}}
				/>
				<MultipleSelectAnswer
					name="form-perferred-ages"
					label="What age(s) would you like to date?"
					choices={range(
						Number(process.env.NEXT_PUBLIC_MIN_AGE),
						Number(process.env.NEXT_PUBLIC_MAX_AGE) + 1
					).map((item) => item.toString())}
					update={(val: string) => {
						submitData.preferredAges = val;
					}}
				/>
				<SelectAnswer
					name="form-gender"
					label="Your gender"
					choices={GenderList}
					update={(val: string) => {
						submitData.gender = val;
					}}
				/>
				<MultipleSelectAnswer
					name="form-perferred-gender"
					label="What gender(s) would you like to date?"
					choices={GenderList}
					update={(val: string) => {
						console.log(val)
						submitData.preferredGenders = val;
					}}
				/>
			</div>
		</div>
	);
}
