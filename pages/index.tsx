import type { NextPage } from 'next';
import Head from 'next/head';
import { Game } from '../components/Game';

const Home: NextPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
      />

      <title>Double</title>
    </Head>

    <Game />
  </div>
);

export default Home;
