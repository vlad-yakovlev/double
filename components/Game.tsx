import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Map, Record } from 'immutable';
import { Block, BlockPosition, creatRandomPower } from '../classes/block';
import { COLS_COUNT, ROWS_COUNT } from '../constants';
import { getRange } from '../utils/array';
import { Controls } from './Controls';

type Task = () => Promise<void>;

const COLUMNS = getRange(0, COLS_COUNT);
const KeyFactory = Record<BlockPosition>({ column: 0, row: 0 });
const getKey = (column: number, row: number) => KeyFactory({ column, row });

export const Game: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef(Map<Record<BlockPosition>, Block>());
  const [isLoading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [awaitingPower, setAwaitingPower] = useState<number>(creatRandomPower(1, 1));
  const [minPower, setMinPower] = useState(1);
  const [maxPower, setMaxPower] = useState(6);

  const getBlock = useCallback((column: number, row: number) => {
    return blocksRef.current.get(getKey(column, row));
  }, []);

  const setBlock = useCallback((column: number, row: number, block: Block) => {
    getBlock(column, row)?.el.remove();
    blocksRef.current = blocksRef.current.set(getKey(column, row), block);
    containerRef.current?.appendChild(block.el);
  }, [getBlock]);

  const moveBlockInColumn = useCallback(async (column: number, fromRow: number, toRow: number) => {
    if (fromRow === toRow) return;

    const block = getBlock(column, fromRow)!;
    await block.moveTo(column, toRow);

    blocksRef.current = blocksRef.current
      .remove(getKey(column, fromRow))
      .set(getKey(column, toRow), block);
  }, [getBlock]);

  const removeBlock = useCallback((column: number, row: number) => {
    getBlock(column, row)?.el.remove();
    blocksRef.current = blocksRef.current.remove(getKey(column, row));
  }, [getBlock]);

  const normalizeColumn = useCallback(async (column: number) => {
    let nextRow = 0;
    const toRows = new Array(ROWS_COUNT).fill(-1).map((_, row) => (getBlock(column, row) ? nextRow++ : -1));
    await Promise.all(toRows.map((toRow, fromRow) => toRow >= 0 && moveBlockInColumn(column, fromRow, toRow)));
  }, [getBlock, moveBlockInColumn]);

  const updateColumn = useCallback(async (column: number) => {
    for (let row = ROWS_COUNT; row >= 0; row--) {
      const current = getBlock(column, row);

      if (current) {
        const topNeighbor = getBlock(column, row - 1);
        const leftNeighbor = getBlock(column - 1, row);
        const rightNeighbor = getBlock(column + 1, row);

        const topNeighborEquals = topNeighbor?.power === current.power;
        const leftNeighborEquals = leftNeighbor?.power === current.power;
        const rightNeighborEquals = rightNeighbor?.power === current.power;

        const addCount = Number(topNeighborEquals) + Number(leftNeighborEquals) + Number(rightNeighborEquals);

        if (topNeighborEquals && addCount === 1) {
          await current.moveTo(column, row - 1);
          removeBlock(column, row);
          setBlock(column, row - 1, new Block(current.power + 1, column, row - 1));
        } else if (addCount) {
          await Promise.all([
            topNeighborEquals && topNeighbor?.moveTo(column, row),
            leftNeighborEquals && leftNeighbor?.moveTo(column, row),
            rightNeighborEquals && rightNeighbor?.moveTo(column, row),
          ]);

          setBlock(column, row, new Block(current.power + addCount, column, row));

          if (topNeighborEquals) removeBlock(column, row - 1);
          if (leftNeighborEquals) removeBlock(column - 1, row);
          if (rightNeighborEquals) removeBlock(column + 1, row);
        }

        if (addCount) {
          await Promise.all([
            normalizeColumn(0),
            normalizeColumn(1),
            normalizeColumn(2),
            normalizeColumn(3),
            normalizeColumn(4),
          ]);

          setTasks([
            () => updateColumn(column),
            () => updateColumn(column - 1),
            () => updateColumn(column + 1),
            () => updateColumn(column - 2),
            () => updateColumn(column + 2),
            () => updateColumn(column - 3),
            () => updateColumn(column + 3),
            () => updateColumn(column - 4),
            () => updateColumn(column + 4),
          ]);

          break;
        }
      }
    }
  }, [getBlock, normalizeColumn, removeBlock, setBlock]);

  const insertBlock = useCallback(async (power: number, column: number, row: number) => {
    const insertRow = row < ROWS_COUNT - 1 ? ROWS_COUNT - 1 : row;

    const block = new Block(power, column, insertRow);
    setBlock(column, row, block);
    await block.moveTo(column, row);
    setTasks([() => updateColumn(column)]);
  }, [setBlock, updateColumn]);

  const handleColumnClick = useCallback((column: number) => {
    let row = 0;
    for (; getBlock(column, row); row++);

    if (!isLoading && (row < ROWS_COUNT || getBlock(column, row - 1)?.power === awaitingPower)) {
      setTasks([async () => {
        setAwaitingPower(creatRandomPower(minPower, maxPower));
        await insertBlock(awaitingPower, column, row);
      }]);
    }
  }, [awaitingPower, getBlock, insertBlock, isLoading, maxPower, minPower]);

  useEffect(() => {
    (async () => {
      if (!isLoading && tasks.length) {
        const task = tasks[0];
        setLoading(true);
        setTasks(tasks.slice(1));
        await task();
        setLoading(false);
      }
    })();
  }, [isLoading, tasks]);

  return (
    <div className="w-92 bg-slate-900 rounded-2xl select-none">
      <div className="p-2">
        <div
          className="relative grid grid-cols-field gap-2 "
          ref={containerRef}
        >
          {COLUMNS.map((index) => (
            <div
              key={index}
              className="h-124 bg-gradient-to-b from-slate-700 to-transparent rounded-lg"
              onClick={() => handleColumnClick(index)}
            />
          ))}
        </div>
      </div>

      <Controls awaitingPower={awaitingPower} />
    </div>
  );
};
