import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { Select } from '../components/Select/Select';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card/Card';
import { Alert } from '../components/Alert/Alert';
import { Stack } from '../components/Stack/Stack';
import { Typography, H1, H2, H3, Text, Caption, Code } from '../components/Typography/Typography';
import { Icon, NamedIcon, icons } from '../components/Icon/Icon';

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--ds-spacing-layout-xl)' }}>
      <H2
        style={{
          marginBottom: 'var(--ds-spacing-component-md)',
          borderBottom: '1px solid var(--ds-color-border-default)',
          paddingBottom: 'var(--ds-spacing-component-sm)',
        }}
      >
        {title}
      </H2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [dismissed, setDismissed] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--ds-color-background-default)',
        color: 'var(--ds-color-text-default)',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'var(--ds-color-surface-default)',
          borderBottom: '1px solid var(--ds-color-border-default)',
          padding: 'var(--ds-spacing-component-md) var(--ds-spacing-layout-lg)',
        }}
      >
        <Stack direction="row" justify="between" align="center">
          <Stack direction="row" align="center" gap="sm">
            <Icon label="One Design System logo" size="lg" color="primary">
              {icons.sun}
            </Icon>
            <Typography variant="h4">One Design System</Typography>
          </Stack>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            iconLeft={<NamedIcon name={theme === 'dark' ? 'sun' : 'moon'} size="sm" />}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </Stack>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: 'var(--ds-spacing-layout-xl) var(--ds-spacing-layout-lg)',
        }}
      >
        <Stack gap="none">
          <H1 style={{ marginBottom: 'var(--ds-spacing-component-xs)' }}>Component Demo</H1>
          <Text color="subtle" style={{ marginBottom: 'var(--ds-spacing-layout-xl)' }}>
            A live reference for every component in the library. Toggle the theme in the header to
            test dark mode.
          </Text>

          {/* ---------------------------------------------------------------- */}
          <Section title="Typography">
            <Stack gap="sm">
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
              <Typography variant="body-lg">Body large — Lorem ipsum dolor sit amet.</Typography>
              <Typography variant="body">
                Body — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body-sm">Body small — Lorem ipsum dolor sit amet.</Typography>
              <Typography variant="caption" color="subtle">
                Caption — used for supplemental text.
              </Typography>
              <Typography variant="overline">Overline label</Typography>
              <Code>{'const greeting = "hello world";'}</Code>
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Button">
            <Stack gap="md">
              <Stack direction="row" wrap="wrap" gap="sm" align="center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </Stack>
              <Stack direction="row" wrap="wrap" gap="sm" align="center">
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra large</Button>
              </Stack>
              <Stack direction="row" wrap="wrap" gap="sm" align="center">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button iconLeft={<NamedIcon name="plus" size="sm" />}>With icon</Button>
                <Button iconRight={<NamedIcon name="chevronDown" size="sm" />} variant="secondary">
                  Trailing icon
                </Button>
              </Stack>
              <Button fullWidth>Full width</Button>
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Input">
            <Stack gap="md" style={{ maxWidth: '420px' }}>
              <Input
                label="Default"
                placeholder="Enter some text…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                hint="This is a hint message."
              />
              <Input
                label="With adornments"
                placeholder="Search…"
                startAdornment={<NamedIcon name="search" size="sm" color="muted" />}
                endAdornment={<Caption color="muted">⌘K</Caption>}
              />
              <Input label="Success state" status="success" defaultValue="valid@email.com" />
              <Input label="Error state" errorMessage="This field is required." />
              <Input label="Disabled" disabled defaultValue="Cannot edit" />
              <Input label="Required" required placeholder="Cannot be empty" />
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Select">
            <Stack gap="md" style={{ maxWidth: '420px' }}>
              <Select
                label="Favourite fruit"
                placeholder="Pick one…"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                hint="Choose your favourite."
                options={[
                  { value: 'apple', label: 'Apple' },
                  { value: 'banana', label: 'Banana' },
                  { value: 'cherry', label: 'Cherry' },
                  { value: 'durian', label: 'Durian', disabled: true },
                ]}
              />
              <Select
                label="Grouped options"
                placeholder="Pick a city…"
                options={[
                  {
                    label: 'UK',
                    options: [
                      { value: 'london', label: 'London' },
                      { value: 'manchester', label: 'Manchester' },
                    ],
                  },
                  {
                    label: 'US',
                    options: [
                      { value: 'new-york', label: 'New York' },
                      { value: 'chicago', label: 'Chicago' },
                    ],
                  },
                ]}
              />
              <Select
                label="Error state"
                errorMessage="Please select an option."
                options={[{ value: 'a', label: 'Option A' }]}
              />
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Alert">
            <Stack gap="sm">
              <Alert variant="info" title="Information">
                This is an informational message to let you know something useful.
              </Alert>
              <Alert variant="success" title="Success">
                Your changes have been saved successfully.
              </Alert>
              <Alert variant="warning" title="Warning">
                This action cannot be undone. Please proceed with caution.
              </Alert>
              <Alert variant="error" title="Error">
                Something went wrong. Please try again later.
              </Alert>
              {!dismissed && (
                <Alert variant="info" onDismiss={() => setDismissed(true)}>
                  This alert can be dismissed. Click the × to close it.
                </Alert>
              )}
              {dismissed && (
                <Button size="sm" variant="ghost" onClick={() => setDismissed(false)}>
                  Restore dismissed alert
                </Button>
              )}
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Card">
            <Stack direction="row" wrap="wrap" gap="md" align="start">
              <Card style={{ flex: '1 1 240px' }}>
                <CardHeader>
                  <H3>Default card</H3>
                </CardHeader>
                <CardBody>
                  <Text color="subtle">A simple card with header, body, and footer.</Text>
                </CardBody>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              <Card elevation="md" bordered style={{ flex: '1 1 240px' }}>
                <CardHeader>
                  <H3>Bordered + elevated</H3>
                </CardHeader>
                <CardBody>
                  <Text color="subtle">
                    Uses <Code>elevation="md"</Code> and <Code>bordered</Code>.
                  </Text>
                </CardBody>
              </Card>

              <Card interactive elevation="sm" style={{ flex: '1 1 240px', cursor: 'pointer' }}>
                <CardBody>
                  <Stack gap="xs">
                    <NamedIcon name="info" size="lg" color="primary" />
                    <H3>Interactive card</H3>
                    <Text color="subtle">Hover to see the interaction styles.</Text>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Icon">
            <Stack direction="row" wrap="wrap" gap="md" align="center">
              {(Object.keys(icons) as Array<keyof typeof icons>).map((name) => (
                <Stack key={name} align="center" gap="xs">
                  <NamedIcon name={name} size="lg" color="default" />
                  <Caption color="subtle">{name}</Caption>
                </Stack>
              ))}
            </Stack>
          </Section>

          {/* ---------------------------------------------------------------- */}
          <Section title="Stack">
            <Stack gap="md">
              <Text color="subtle">Row with gap and wrapping:</Text>
              <Stack direction="row" gap="sm" wrap="wrap">
                {['One', 'Two', 'Three', 'Four', 'Five'].map((label) => (
                  <Card key={label} padding="sm" elevation="xs">
                    <Text>{label}</Text>
                  </Card>
                ))}
              </Stack>

              <Text color="subtle">Column with center alignment:</Text>
              <Stack direction="column" align="center" gap="sm">
                <Button variant="primary" style={{ width: '200px' }}>
                  Centred button
                </Button>
                <Button variant="secondary" style={{ width: '200px' }}>
                  Centred button
                </Button>
              </Stack>
            </Stack>
          </Section>
        </Stack>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--ds-color-border-default)',
          padding: 'var(--ds-spacing-component-lg) var(--ds-spacing-layout-lg)',
          textAlign: 'center',
        }}
      >
        <Caption color="muted">
          One Design System — token-driven, theme-aware React component library
        </Caption>
      </footer>
    </div>
  );
}
