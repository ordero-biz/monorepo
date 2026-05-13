import './LayoutBox.css';
import type { LayoutBoxProps } from './types';

export const LayoutBox = ({ children }: LayoutBoxProps) => (
  <section className="layout-content">{children}</section>
);
