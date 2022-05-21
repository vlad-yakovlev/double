import { FC, useCallback, useState } from 'react';
import { Controls } from './Controls';
import { Field } from './Field';
import { BlockData } from '../types/block';
import { createBlock, creatRandomBlock } from '../utils/block';

const MAX_BLOCKS_IN_COLUMN = 7;

export const Game: FC = () => {
  const [columns, setColumns] = useState<BlockData[][]>([[], [], [], [], []]);
  const [awaitingBlock, setAwaitingBlock] = useState<BlockData>(creatRandomBlock(1, 1));
  const [minPower, setMinPower] = useState(1);
  const [maxPower, setMaxPower] = useState(6);

  const handleColumnClick = useCallback((columnIndex: number) => {
    const newColumns = columns.map((blocks) => blocks.map((block) => block));
    let newAwaitingBlock = awaitingBlock;
    const targetColumn = newColumns[columnIndex] as (BlockData | undefined)[];
    const prevColumn = newColumns[columnIndex - 1] as (BlockData | undefined)[] | undefined;
    const nextColumn = newColumns[columnIndex + 1] as (BlockData | undefined)[] | undefined;

    if (targetColumn.length < MAX_BLOCKS_IN_COLUMN || targetColumn[targetColumn.length - 1]?.power === awaitingBlock.power) {
      targetColumn.push(awaitingBlock);

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const blockIndex = targetColumn.length - 1;

        const targetColumnEquals = targetColumn[blockIndex]?.power === targetColumn[blockIndex - 1]?.power;
        const prevColumnEquals = targetColumn[blockIndex]?.power === prevColumn?.[blockIndex]?.power;
        const nextColumnEquals = targetColumn[blockIndex]?.power === nextColumn?.[blockIndex]?.power;

        const addCount = Number(targetColumnEquals) + Number(prevColumnEquals) + Number(nextColumnEquals);
        if (addCount === 0) break;

        targetColumn.splice(blockIndex, 1, createBlock(targetColumn[blockIndex]!.power + addCount));

        if (targetColumnEquals) targetColumn.splice(blockIndex - 1, 1);
        if (prevColumnEquals) prevColumn?.splice(blockIndex, 1);
        if (nextColumnEquals) nextColumn?.splice(blockIndex, 1);
      }

      newAwaitingBlock = creatRandomBlock(minPower, maxPower);
    }

    setColumns(newColumns);
    setAwaitingBlock(newAwaitingBlock);
  }, [columns, awaitingBlock, minPower, maxPower]);

  return (
    <div className="w-92 bg-slate-900 rounded-2xl shadow-2xl select-none">
      <Field
        columns={columns}
        onColumnClick={handleColumnClick}
      />
      <Controls awaitingBlock={awaitingBlock} />
    </div>
  );
};
