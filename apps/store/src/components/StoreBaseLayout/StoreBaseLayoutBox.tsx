import './StoreBaseLayoutBox.css';
import type { StoreBaseLayoutBoxProps } from './StoreBaseLayoutBox.types';

export const StoreBaseLayoutBox = ({ children }: StoreBaseLayoutBoxProps) => (
  <section className="layout-content">{children}</section>
);
