import {fireEvent, render, screen, within} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './Sidebar';

vi.mock('@ordero/ui/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('Sidebar', () => {
  it('renders sidebar content', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Navigation</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('toggles the desktop sidebar state', () => {
    const { container } = render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarContent>Navigation</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const sidebar = container.querySelector(
      '[data-slot="sidebar"][data-state]'
    );
    const trigger = within(container).getByRole('button', {
      name: /toggle sidebar/i,
    });

    expect(sidebar).toHaveAttribute('data-state', 'expanded');

    fireEvent.click(trigger);

    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  });

  it('hides specific elements when collapsed', () => {
    const { container } = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Group Label</SidebarGroupLabel>
              <SidebarGroupAction>Group Action</SidebarGroupAction>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <span>Menu Button</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction>Menu Action</SidebarMenuAction>
                  <SidebarMenuBadge>1</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const sidebar = container.querySelector('[data-slot="sidebar"]');
    // Initially it should be collapsed because defaultOpen={false} and collapsible="icon"
    expect(sidebar).toHaveAttribute('data-icon-state', 'collapsed');

    const groupLabel = screen.getByText('Group Label');
    const groupAction = screen.getByText('Group Action');
    const menuAction = screen.getByText('Menu Action');
    const menuBadge = screen.getByText('1');

    expect(groupLabel).toHaveClass(
      'group-data-[icon-state=collapsed]:opacity-0'
    );
    expect(groupAction).toHaveClass('group-data-[icon-state=collapsed]:hidden');
    expect(menuAction).toHaveClass('group-data-[icon-state=collapsed]:hidden');
    expect(menuBadge).toHaveClass('group-data-[icon-state=collapsed]:hidden');
  });

  it('SidebarMenuButton renders correctly when collapsed', () => {
    const { container } = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span data-testid="icon">🏠</span>
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const menuButton = container.querySelector(
      '[data-slot="sidebar-menu-button"]'
    );
    // It should have the collapsed classes
    expect(menuButton).toHaveClass(
      'group-data-[icon-state=collapsed]:flex-col'
    );
    expect(menuButton).toHaveClass('group-data-[icon-state=collapsed]:py-2');
  });
});
