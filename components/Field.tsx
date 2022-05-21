import { FC } from 'react';
import { BlockData } from '../types/block';
import { Column } from './Column';

interface Props {
  columns: BlockData[][]
  onColumnClick: (columnIndex: number) => void
}

export const Field: FC<Props> = ({ columns, onColumnClick }) => {
  return (
    <div className="grid grid-cols-field gap-2 p-2">
      {columns.map((blocks, index) => (
        <Column
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          blocks={blocks}
          onClick={() => onColumnClick(index)}
        />
      ))}
    </div>
  );
};
