import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabList, Tab, TabPanel } from '../components/Tabs/Tabs';

function renderTabs(defaultValue = 'a') {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabList>
        <Tab value="a">Alpha</Tab>
        <Tab value="b">Beta</Tab>
        <Tab value="c" disabled>
          Gamma
        </Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
    </Tabs>
  );
}

const setup = (jsx: React.ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});

describe('Tabs', () => {
  describe('rendering', () => {
    it('renders a tablist', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders all tab buttons', () => {
      renderTabs();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('renders all tab panels', () => {
      renderTabs();
      expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(3);
    });

    it('shows the default active tab panel', () => {
      renderTabs('a');
      expect(screen.getByRole('tabpanel', { name: /alpha/i })).not.toHaveAttribute('hidden');
    });

    it('hides non-active panels', () => {
      renderTabs('a');
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      const betaPanel = panels.find((p) => p.textContent?.includes('Panel B'))!;
      expect(betaPanel).toHaveAttribute('hidden');
    });
  });

  describe('ARIA attributes', () => {
    it('sets aria-selected on the active tab', () => {
      renderTabs('a');
      expect(screen.getByRole('tab', { name: /alpha/i })).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected=false on inactive tabs', () => {
      renderTabs('a');
      expect(screen.getByRole('tab', { name: /beta/i })).toHaveAttribute('aria-selected', 'false');
    });

    it('wires aria-controls from tab to panel', () => {
      renderTabs('a');
      const tab = screen.getByRole('tab', { name: /alpha/i });
      const panelId = tab.getAttribute('aria-controls')!;
      expect(document.getElementById(panelId)).toHaveTextContent('Panel A');
    });

    it('wires aria-labelledby from panel to tab', () => {
      renderTabs('a');
      const panel = screen.getByRole('tabpanel', { name: /alpha/i });
      const tabId = panel.getAttribute('aria-labelledby')!;
      expect(document.getElementById(tabId)).toHaveTextContent('Alpha');
    });

    it('sets tabIndex=0 on active tab and -1 on others', () => {
      renderTabs('a');
      expect(screen.getByRole('tab', { name: /alpha/i })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('tab', { name: /beta/i })).toHaveAttribute('tabindex', '-1');
    });

    it('marks disabled tab as disabled', () => {
      renderTabs();
      expect(screen.getByRole('tab', { name: /gamma/i })).toBeDisabled();
    });
  });

  describe('click interactions', () => {
    it('activates a tab on click', async () => {
      const { user } = setup(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );
      await user.click(screen.getByRole('tab', { name: /^b$/i }));
      expect(screen.getByRole('tab', { name: /^b$/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel', { name: /^b$/i })).not.toHaveAttribute('hidden');
    });

    it('calls onChange when a tab is clicked', async () => {
      const onChange = vi.fn();
      const { user } = setup(
        <Tabs defaultValue="a" onChange={onChange}>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );
      await user.click(screen.getByRole('tab', { name: /^b$/i }));
      expect(onChange).toHaveBeenCalledWith('b');
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus right with ArrowRight', async () => {
      const { user } = setup(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
            <Tab value="c">C</Tab>
          </TabList>
          <TabPanel value="a">A</TabPanel>
          <TabPanel value="b">B</TabPanel>
          <TabPanel value="c">C</TabPanel>
        </Tabs>
      );
      await user.tab();
      expect(screen.getByRole('tab', { name: /^a$/i })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: /^b$/i })).toHaveFocus();
    });

    it('moves focus left with ArrowLeft', async () => {
      const { user } = setup(
        <Tabs defaultValue="b">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
            <Tab value="c">C</Tab>
          </TabList>
          <TabPanel value="a">A</TabPanel>
          <TabPanel value="b">B</TabPanel>
          <TabPanel value="c">C</TabPanel>
        </Tabs>
      );
      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: /^a$/i })).toHaveFocus();
    });

    it('wraps from last to first with ArrowRight', async () => {
      const { user } = setup(
        <Tabs defaultValue="c">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
            <Tab value="c">C</Tab>
          </TabList>
          <TabPanel value="a">A</TabPanel>
          <TabPanel value="b">B</TabPanel>
          <TabPanel value="c">C</TabPanel>
        </Tabs>
      );
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: /^a$/i })).toHaveFocus();
    });

    it('jumps to first tab with Home', async () => {
      const { user } = setup(
        <Tabs defaultValue="c">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
            <Tab value="c">C</Tab>
          </TabList>
          <TabPanel value="a">A</TabPanel>
          <TabPanel value="b">B</TabPanel>
          <TabPanel value="c">C</TabPanel>
        </Tabs>
      );
      await user.tab();
      await user.keyboard('{Home}');
      expect(screen.getByRole('tab', { name: /^a$/i })).toHaveFocus();
    });

    it('jumps to last tab with End', async () => {
      const { user } = setup(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
            <Tab value="c">C</Tab>
          </TabList>
          <TabPanel value="a">A</TabPanel>
          <TabPanel value="b">B</TabPanel>
          <TabPanel value="c">C</TabPanel>
        </Tabs>
      );
      await user.tab();
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: /^c$/i })).toHaveFocus();
    });

    it('uses ArrowDown/ArrowUp for vertical orientation', async () => {
      const { user } = setup(
        <Tabs defaultValue="a" orientation="vertical">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">A</TabPanel>
          <TabPanel value="b">B</TabPanel>
        </Tabs>
      );
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('tab', { name: /^b$/i })).toHaveFocus();
    });
  });

  describe('lazy rendering', () => {
    it('does not render inactive panels when lazy=true', () => {
      render(
        <Tabs defaultValue="a" lazy>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );
      expect(screen.queryByText('Panel B')).not.toBeInTheDocument();
    });

    it('renders panel content when tab is activated with lazy=true', async () => {
      const { user } = setup(
        <Tabs defaultValue="a" lazy>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );
      await user.click(screen.getByRole('tab', { name: /^b$/i }));
      expect(screen.getByText('Panel B')).toBeInTheDocument();
    });
  });
});
