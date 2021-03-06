import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Map, Record } from 'immutable';
import { Block, BlockPosition, createRandomPower } from '../classes/block';
import { COLS_COUNT, ROWS_COUNT } from '../constants';
import { getRange } from '../utils/array';
import { Controls } from './Controls';
import { Button } from './Button';
import { Overlay } from './Overlay';
import { getBlockValue } from '../utils/block';
import { ScoreBar } from './ScoreBar';

const COLUMNS = getRange(0, COLS_COUNT);
const KeyFactory = Record<BlockPosition>({ column: 0, row: 0 });
const getKey = (column: number, row: number) => KeyFactory({ column, row });

export const Game: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef(Map<Record<BlockPosition>, Block>());
  const [isLoading, setLoading] = useState(false);
  const [columnsForUpdate, setColumnsForUpdate] = useState<number[]>([]);
  const [awaitingPower, setAwaitingPower] = useState<number>(createRandomPower(1, 1));
  const minPower = useRef(1);
  const maxPower = useRef(6);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const getBlock = useCallback((column: number, row: number) => {
    return blocksRef.current.get(getKey(column, row));
  }, []);

  const setBlock = useCallback((column: number, row: number, block: Block) => {
    getBlock(column, row)?.el.remove();
    blocksRef.current = blocksRef.current.set(getKey(column, row), block);
    containerRef.current?.appendChild(block.el);
    setScore((oldScore) => oldScore + 2 ** block.power);
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
    for (let row = 0; row <= ROWS_COUNT; row++) {
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
          // eslint-disable-next-line @typescript-eslint/no-shadow
          await Promise.all(COLUMNS.map((column) => normalizeColumn(column)));

          const newColumnsForUpdate = [column];
          for (let offset = 1; offset < COLUMNS.length; offset++) {
            newColumnsForUpdate.push(column - offset, column + offset);
          }
          setColumnsForUpdate(newColumnsForUpdate);

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
    setColumnsForUpdate([column]);
  }, [setBlock]);

  const handleColumnClick = useCallback(async (column: number) => {
    let row = 0;
    for (; getBlock(column, row); row++);

    if (!isLoading && (row < ROWS_COUNT || getBlock(column, row - 1)?.power === awaitingPower)) {
      setAwaitingPower(createRandomPower(minPower.current, maxPower.current));
      await insertBlock(awaitingPower, column, row);
    }
  }, [awaitingPower, getBlock, insertBlock, isLoading]);

  const isGameOver = useMemo(() => {
    return !isLoading && !columnsForUpdate.length && COLUMNS.every((column) => {
      const block = getBlock(column, ROWS_COUNT - 1);
      return block && block.power !== awaitingPower;
    });
  }, [awaitingPower, columnsForUpdate.length, getBlock, isLoading]);

  const isMessageVisible = useMemo(() => {
    return !isLoading && !columnsForUpdate.length && Boolean(message);
  }, [columnsForUpdate.length, isLoading, message]);

  const updateBounds = useCallback(() => {
    const maxAllowedPower = minPower.current * 3 + 2 ** 3; // Looks more magical then 8
    const hasGreaterPower = blocksRef.current.some((block) => block.power >= maxAllowedPower);
    if (!hasGreaterPower) return;

    setMessage(`${getBlockValue(minPower.current)} cleared`);
    minPower.current++;
    maxPower.current++;

    blocksRef.current.forEach((block, key) => {
      if (block.power < minPower.current) {
        removeBlock(key.get('column'), key.get('row'));
      }
    });
  }, [removeBlock]);

  useEffect(() => {
    (async () => {
      if (!isLoading && columnsForUpdate.length) {
        const columnForUpdate = columnsForUpdate[0];
        setLoading(true);
        setColumnsForUpdate(columnsForUpdate.slice(1));
        await updateColumn(columnForUpdate);
        setLoading(false);
      }

      if (!isLoading && !columnsForUpdate.length) {
        const prevBlocks = blocksRef.current;
        updateBounds();

        if (blocksRef.current !== prevBlocks) {
          setLoading(true);
          await Promise.all(COLUMNS.map((column) => normalizeColumn(column)));
          setColumnsForUpdate(COLUMNS);
          setAwaitingPower(createRandomPower(minPower.current, maxPower.current));
          setLoading(false);
        }
      }
    })();
  }, [isLoading, columnsForUpdate, updateColumn, updateBounds, normalizeColumn]);

  return (
    <div className="relative w-92 bg-slate-900 rounded-2xl select-none">
      <ScoreBar score={score} />

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

      {isGameOver && (
        <Overlay>
          <div className="text-4xl text-white uppercase">Game over</div>
          <div className="text-4xl text-white uppercase">{`Score: ${score}`}</div>
          <Button onClick={() => window.location.reload()}>Restart</Button>
        </Overlay>
      )}

      {isMessageVisible ? (
        <Overlay>
          <div className="text-4xl text-white uppercase">{message}</div>
          <Button onClick={() => setMessage('')}>Got it!</Button>
        </Overlay>
      ) : null}
    </div>
  );
};
