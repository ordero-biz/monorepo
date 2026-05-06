import type { Preview } from '@storybook/react-vite';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import '@fontsource/public-sans/800.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import './preview.css';

type ThemeMode = 'light' | 'dark';

const themeClassName = 'dark';

const applyThemeMode = (themeMode: ThemeMode) => {
  const isDarkMode = themeMode === 'dark';

  document.documentElement.classList.toggle(themeClassName, isDarkMode);
  document.body.classList.toggle(themeClassName, isDarkMode);
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for component previews',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const themeMode = context.globals.theme === 'dark' ? 'dark' : 'light';

      applyThemeMode(themeMode);

      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
  },
};

export default preview;
