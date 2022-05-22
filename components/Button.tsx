import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode
  onClick: () => void
}

export const Button: FC<Props> = ({ onClick, children }) => (
  <button
    className="px-4 py-2 border border-white rounded-lg text-lg text-white uppercase"
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
);
