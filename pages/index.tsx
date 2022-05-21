import type { NextPage } from 'next';
import { Game } from '../components/Game';

const Home: NextPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Game />
  </div>
);

export default Home;
