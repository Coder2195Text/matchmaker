import styles from "../styles/Form.module.css";
import { Dictionary, range, update } from "lodash";

import { Session } from "next-auth";
import { GenderList } from "../utils/constants";
import { Applicant } from "@prisma/client";
import { clearInvalid, fetcher, validateResponse } from "../utils/tools";
import useSWR from "swr";
import { signOut } from "next-auth/react";
import { useState } from "react";

function ShortAnswer(props: {
	label: string;
	placeholder: string;
	name: string;
	maxLength: number;
	initVal: string;
	update: Function;
}) {
	return (
		<div className="form-question" id={props.name}>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			{": "}
			<input
				type="text"
				name={props.name}
				placeholder={props.placeholder}
				maxLength={props.maxLength}
				className={styles.textInput}
				onInput={(event) => {
					props.update(event.currentTarget.value);
					clearInvalid(event.currentTarget.parentElement);
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
		<div className="form-question" id={props.name}>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			{": "}
			<select
				name={props.name}
				className={styles.selectInput}
				onChange={function (event) {
					props.update(event.currentTarget.value);
					clearInvalid(event.currentTarget.parentElement);
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
	maxLength: number;
}) {
	return (
		<div className="form-question" id={props.name}>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}
			</label>
			{": "}
			<br />
			<textarea
				name={props.name}
				className={styles.textArea}
				maxLength={props.maxLength}
				onChange={(event) => {
					props.update(event.target.value);
				}}
				onInput={(event) => {
					clearInvalid(event.currentTarget.parentElement);
				}}
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
		<div className="form-question" id={props.name}>
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
								clearInvalid(event.target.parentElement.parentElement);
								checkedDict[event.target.name] = event.target.checked;
								const returnArray = [];
								for (const item in checkedDict) {
									if (checkedDict[item]) returnArray.push(item);
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

function NumberInput(props: {
	label: string;
	name: string;
	update: Function;
	min: number;
	max: number;
}) {
	return (
		<div className="form-question" id={props.name}>
			<label className={styles.label} htmlFor={props.name}>
				{props.label}:
			</label>
			<input
				className={styles.textInput}
				defaultValue={0}
				min={props.min}
				max={props.max}
				type="number"
				name={props.name}
				onInput={(event) => props.update(event.currentTarget.value)}
			/>
		</div>
	);
}

function LoadingScreen() {
	return <div className={styles.loading}>Loading...</div>;
}

function AlreadyCompleted(props: { user: Session; mutate: Function }) {
	return (
		<div className={styles.form}>
			<h3>
				You have already completed this form. Would you like to submit a new
				form and delete the old one?
			</h3>
			<button
				className={styles.actionButton}
				onClick={(event) => {
					if (confirm("Are you sure you want to resubmit?")) {
						event.currentTarget.innerText = "Deleting..."
						fetch(
							`api/db/deleteUser?password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}&id=${props.user.id}`,
							{
								method: "DELETE",
							}
						).then(() => {
							props.mutate();
						});
					}
				}}
			>
				Delete and Resubmit
			</button>
		</div>
	);
}

export default function Form(props: { session: Session }) {
	const user = props.session;
	let { data, error, mutate } = useSWR(
		`/api/db/getUser?id=${user.id}&password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
		fetcher
	);
	const submitData: Applicant = {
		aboutYou: "",
		age: Number(process.env.NEXT_PUBLIC_MIN_AGE),
		gender: GenderList[0],
		hobbies: "",
		id: user.id,
		idealDesc: "",
		location: "",
		preferredLocationRadius: 0,
		name: "",
		preferredAges: "",
		preferredGenders: "",
		username: user.username + "#" + user.discriminator,
		profile: user.image_url,
	};
	if (error) return <div className={styles.loading}>Load Failed.</div>;
	if (data==null) return <LoadingScreen />;
	if (data && Object.values(data).length != 0) {
		return <AlreadyCompleted mutate={mutate} user={user} />;
	}
	return (
		<div className={styles.form}>
			<h4>
				Logged in as {user.username}#{user.discriminator}. Not you?{" "}
				<button
					onClick={() => {
						signOut();
					}}
					className={styles.actionButton}
				>
					Log out
				</button>
			</h4>
			<ShortAnswer
				name="form-name"
				label="Name"
				placeholder="Your name"
				maxLength={100}
				initVal=""
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
				name="form-preferred-ages"
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
				name="form-preferred-gender"
				label="What gender(s) would you like to date?"
				choices={GenderList}
				update={(val: string) => {
					submitData.preferredGenders = val;
				}}
			/>

			<ShortAnswer
				maxLength={200}
				placeholder=""
				initVal=""
				name="form-location"
				label="Location of your city/town (i.e. New York City, USA)"
				update={(val: string) => {
					submitData.location = val;
				}}
			/>

			<NumberInput
				name="form-preferred-distance"
				label="Radius of people from your location that your comfortable dating in KM"
				min={0}
				max={12500}
				update={(val: string) => {
					submitData.preferredLocationRadius = Number(val);
				}}
			/>

			<OpenEndedQuestion
				name="form-about-yourself"
				label="Tell me about yourself..."
				maxLength={3000}
				update={(val: string) => {
					submitData.aboutYou = val;
				}}
			/>
			<OpenEndedQuestion
				name="form-hobbies"
				label="What are some of your hobbies?"
				maxLength={1000}
				update={(val: string) => {
					submitData.hobbies = val;
				}}
			/>
			<OpenEndedQuestion
				name="form-ideal-mate"
				label="What would make an ideal match?"
				maxLength={3000}
				update={(val: string) => {
					submitData.idealDesc = val;
				}}
			/>
			<button
				className={styles.actionButton}
				onClick={(event) => {
					console.log(JSON.stringify(submitData));
					if (!validateResponse(submitData)) return;
					event.currentTarget.innerText = "Submitting..."
					fetch(
						`api/db/addUser?password=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
						{
							method: "POST", // *GET, POST, PUT, DELETE, etc.
							mode: "same-origin", // no-cors, *cors, same-origin
							cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
							credentials: "same-origin", // include, *same-origin, omit
							headers: {
								"Content-Type": "application/json",
								// 'Content-Type': 'application/x-www-form-urlencoded',
							},
							redirect: "follow", // manual, *follow, error
							referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
							body: JSON.stringify(submitData), // body data type must match "Content-Type" header
						}
					).then(() => {
						mutate();
					});
				}}
			>
				Submit
			</button>
		</div>
	);
}
