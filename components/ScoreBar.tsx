import { FC } from 'react';

interface Props {
  score: number
}

export const ScoreBar: FC<Props> = ({ score }) => (
  <div className="flex items-center justify-center pt-4 pb-2 text-2xl text-white">{score}</div>
);
