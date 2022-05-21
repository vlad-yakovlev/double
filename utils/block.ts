import { v4 as uuid } from 'uuid';
import { BlockData } from '../types/block';

export const createBlock = (power: number): BlockData => ({
  id: uuid(),
  power,
});

export const creatRandomBlock = (minPower: number, maxPower: number): BlockData => {
  return createBlock(Math.floor(Math.random() * (maxPower - minPower + 1) + minPower));
};
