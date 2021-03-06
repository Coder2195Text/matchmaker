import type { NextPage } from "next";
import Head from "next/head";
import Form from "../components/form";
import styles from "../styles/Home.module.css";
import { PrismaClient } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Login from "../components/login";
import { ReactComponentElement } from "react";

const Home: NextPage = () => {
	const { data: session } = useSession();
	const page = session ? (
		<Form session={session} />
	) : (
		<Login
			login={() => {
				signIn("discord");
			}}
		/>
	);
	return (
		<div>
			<Head>
				<title></title>
				<meta name="description" content="Find a match!" />
				<link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
		</div>
	);
};

export default Home;
