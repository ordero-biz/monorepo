'use client';

import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import type { ToastData, ToastManagerValue } from './types';

export const useToastManager = (): ToastManagerValue =>
  ToastPrimitive.useToastManager<ToastData>();
