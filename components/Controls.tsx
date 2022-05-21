import { FC } from 'react';
import { BlockData } from '../types/block';
import { Block } from './Block';

interface Props {
  awaitingBlock: BlockData
}

export const Controls: FC<Props> = ({ awaitingBlock }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <Block power={awaitingBlock.power} />
    </div>
  );
};
