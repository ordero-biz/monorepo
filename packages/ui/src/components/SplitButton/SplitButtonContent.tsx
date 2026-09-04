'use client';

import { Menu } from '@/ui/components/Menu';
import type { SplitButtonContentProps } from './types';

export const SplitButtonContent = ({
  align = 'end',
  children,
  id,
  maxHeight,
  side,
  sideOffset,
}: SplitButtonContentProps) => (
  <Menu.Portal>
    <Menu.Positioner align={align} side={side} sideOffset={sideOffset}>
      <Menu.Popup id={id} maxHeight={maxHeight}>
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
);
