import type { NextPage } from 'next'
import Head from 'next/head'
import Form from '../components/form'
import styles from '../styles/Home.module.css'
import { PrismaClient } from '@prisma/client'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="Find a match!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form></Form>
    </div>
  )
}

export default Home
