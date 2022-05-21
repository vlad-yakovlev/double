import { FC } from 'react';
import { BlockData } from '../types/block';
import { Block } from './Block';

interface Props {
  blocks: BlockData[];
  onClick: () => void;
}

export const Column: FC<Props> = ({ blocks, onClick }) => {
  return (
    <div
      className="grid grid-rows-column gap-2 bg-gradient-to-b from-slate-700 to-transparent rounded-lg"
      onClick={onClick}
    >
      {blocks.map((block) => (
        <Block
          key={block.id}
          power={block.power}
        />
      ))}
    </div>
  );
};
