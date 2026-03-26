import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

export const cleanupAfterEach = () => afterEach(() => cleanup());
