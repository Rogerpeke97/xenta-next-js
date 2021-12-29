import type { NextPage } from 'next'
import Head from 'next/head'
import DefaultLayout from '../components/layouts/DefaultLayout'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import SideBar from '../components/modules/navigation/SideBar'
import Welcome from '../components/modules/Welcome'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <div className="h-screen flex">
          <SideBar name={"Logo"} />
          <div className="grow">
            <NavigationBar name={"Xenta Web"} />
            <Welcome />
          </div>
        </div>
      </DefaultLayout>
    </div>
  )
}

export default Home
