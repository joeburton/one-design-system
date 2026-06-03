import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;

export default meta;

export const Default: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue="tab1">
    <TabList>
      <Tab value="tab1">Account</Tab>
      <Tab value="tab2">Password</Tab>
      <Tab value="tab3">Notifications</Tab>
    </TabList>
    <TabPanel value="tab1">
      <p>Manage your account settings and preferences.</p>
    </TabPanel>
    <TabPanel value="tab2">
      <p>Update your password and security settings.</p>
    </TabPanel>
    <TabPanel value="tab3">
      <p>Configure how you receive notifications.</p>
    </TabPanel>
  </Tabs>
);

export const Vertical: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue="tab1" orientation="vertical" style={{ minHeight: 200 }}>
    <TabList>
      <Tab value="tab1">Profile</Tab>
      <Tab value="tab2">Billing</Tab>
      <Tab value="tab3">Team</Tab>
    </TabList>
    <TabPanel value="tab1">
      <p>Your profile details and public information.</p>
    </TabPanel>
    <TabPanel value="tab2">
      <p>Manage your subscription and billing details.</p>
    </TabPanel>
    <TabPanel value="tab3">
      <p>Invite and manage your team members.</p>
    </TabPanel>
  </Tabs>
);

export const WithDisabledTab: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue="tab1">
    <TabList>
      <Tab value="tab1">Available</Tab>
      <Tab value="tab2" disabled>
        Disabled
      </Tab>
      <Tab value="tab3">Also Available</Tab>
    </TabList>
    <TabPanel value="tab1">
      <p>This tab is available.</p>
    </TabPanel>
    <TabPanel value="tab2">
      <p>This tab is disabled.</p>
    </TabPanel>
    <TabPanel value="tab3">
      <p>This tab is also available.</p>
    </TabPanel>
  </Tabs>
);

export const Controlled: StoryFn<typeof Tabs> = () => {
  const [value, setValue] = useState('tab1');
  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        Active tab: <strong>{value}</strong>
      </p>
      <Tabs value={value} onChange={setValue}>
        <TabList>
          <Tab value="tab1">First</Tab>
          <Tab value="tab2">Second</Tab>
          <Tab value="tab3">Third</Tab>
        </TabList>
        <TabPanel value="tab1">
          <p>First panel content.</p>
        </TabPanel>
        <TabPanel value="tab2">
          <p>Second panel content.</p>
        </TabPanel>
        <TabPanel value="tab3">
          <p>Third panel content.</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export const LazyPanels: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue="tab1" lazy>
    <TabList>
      <Tab value="tab1">First</Tab>
      <Tab value="tab2">Second (lazy)</Tab>
    </TabList>
    <TabPanel value="tab1">
      <p>First panel — always rendered.</p>
    </TabPanel>
    <TabPanel value="tab2">
      <p>Second panel — only rendered when active.</p>
    </TabPanel>
  </Tabs>
);

export const KeyboardNavigation: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue="tab1">
    <TabList>
      <Tab value="tab1">First</Tab>
      <Tab value="tab2">Second</Tab>
      <Tab value="tab3">Third</Tab>
    </TabList>
    <TabPanel value="tab1">
      <p>Panel 1</p>
    </TabPanel>
    <TabPanel value="tab2">
      <p>Panel 2</p>
    </TabPanel>
    <TabPanel value="tab3">
      <p>Panel 3</p>
    </TabPanel>
  </Tabs>
);
KeyboardNavigation.storyName = 'Keyboard: Arrow key navigation';
KeyboardNavigation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const firstTab = canvas.getByRole('tab', { name: /first/i });

  await userEvent.tab();
  await expect(firstTab).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getByRole('tab', { name: /second/i })).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getByRole('tab', { name: /third/i })).toHaveFocus();

  await userEvent.keyboard('{Home}');
  await expect(firstTab).toHaveFocus();

  await userEvent.keyboard('{End}');
  await expect(canvas.getByRole('tab', { name: /third/i })).toHaveFocus();
};
