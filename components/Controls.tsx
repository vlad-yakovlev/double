import { FC, useEffect, useRef } from 'react';
import { Block } from '../classes/block';

interface Props {
  awaitingPower: number
}

export const Controls: FC<Props> = ({ awaitingPower }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = new Block(awaitingPower, 0, 0);
    containerRef.current?.appendChild(block.el);

    return () => {
      block.el.remove();
    };
  }, [awaitingPower]);

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="relative w-16 h-16"
        ref={containerRef}
      />
    </div>
  );
};
