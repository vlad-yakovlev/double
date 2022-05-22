import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode
}

export const Overlay: FC<Props> = ({ children }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-2xl">
    {children}
  </div>
);
