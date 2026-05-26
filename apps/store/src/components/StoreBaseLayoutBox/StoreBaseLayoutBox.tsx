import './StoreBaseLayoutBox.css';
import type { StoreBaseLayoutBoxProps } from './types';

export const StoreBaseLayoutBox = ({ children }: StoreBaseLayoutBoxProps) => (
  <section className="bg-background layout-content">{children}</section>
);
