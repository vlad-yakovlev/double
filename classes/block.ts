import { v4 as uuid } from 'uuid';
import { getBlockColor, getBlockValue } from '../utils/block';

export interface BlockPosition {
  column: number
  row: number
}

const colors = [
  'bg-red-600',
  'bg-orange-600',
  'bg-amber-600',
  'bg-yellow-600',
  'bg-lime-600',
  'bg-green-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-600',
  'bg-sky-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-purple-600',
  'bg-fuchsia-600',
  'bg-pink-600',
  'bg-rose-600',
];

const BLOCK_SIZE = 4.5;
const TRANSITION_DURATION = 150;

export class Block {
  readonly id: string;

  readonly el: HTMLDivElement;

  readonly power: number;

  column = 0;

  row = 0;

  constructor(power: number, column: number, row: number) {
    this.id = uuid();

    this.el = document.createElement('div');
    this.el.className = 'absolute flex items-center justify-center w-16 h-16 rounded-lg text-xl font-semibold text-white shadow-lg pointer-events-none';

    this.power = power;
    this.el.classList.add(getBlockColor(colors, power));
    this.el.textContent = getBlockValue(power);

    this.setPosition(column, row);
  }

  private setPosition(column: number, row: number) {
    this.column = column;
    this.row = row;

    this.el.style.left = `${column * BLOCK_SIZE}rem`;
    this.el.style.top = `${row * BLOCK_SIZE}rem`;
  }

  async moveTo(column: number, row: number) {
    if (column === this.column && row === this.row) return;

    this.el.clientHeight; // Force repaint
    this.el.style.transition = `transform ${TRANSITION_DURATION}ms ease`;
    this.el.style.transform = `translate(${(column - this.column) * BLOCK_SIZE}rem, ${(row - this.row) * BLOCK_SIZE}rem)`;
    await new Promise((resolve) => { setTimeout(resolve, TRANSITION_DURATION); });

    this.el.style.transition = '';
    this.el.style.transform = '';
    this.setPosition(column, row);
  }
}

export const createRandomPower = (minPower: number, maxPower: number) => {
  return Math.floor(Math.random() * (maxPower - minPower + 1) + minPower);
};
