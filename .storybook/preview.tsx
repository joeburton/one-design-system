import type { Preview, Decorator } from '@storybook/react';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import type { ThemeName } from '../tokens/types/tokens.types';
import '../styles/tokens.css';
import '../styles/themes/dark.css';
import '../styles/global.css';

const withTheme: Decorator = (Story, context) => {
  const themeArg = context.globals['theme'] as ThemeName | undefined;
  const [theme, setTheme] = useState<ThemeName>(themeArg ?? 'light');

  useEffect(() => {
    if (themeArg) setTheme(themeArg);
  }, [themeArg]);

  return (
    <ThemeProvider defaultTheme={theme}>
      <div
        style={{
          padding: '2rem',
          minHeight: '100vh',
          background: 'var(--ds-color-background-default)',
          color: 'var(--ds-color-text-default)',
          fontFamily: 'var(--ds-typography-fontFamily-body)',
          transition: 'background 200ms, color 200ms',
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
