import './BaseLayoutBox.css';
import type { BaseLayoutBoxProps } from './types';

export const BaseLayoutBox = ({ children }: BaseLayoutBoxProps) => (
  <section className="bg-background layout-content">{children}</section>
);
