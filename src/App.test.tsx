import React, { useEffect } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedLayout } from './App';
import { UserProvider } from './context/UserContext';

const onPageMount = vi.fn();

function Page() {
  useEffect(() => onPageMount(), []);
  return <textarea aria-label="Draft note" />;
}

function setWidth(width: number) {
  window.innerWidth = width;
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

async function renderAt(width: number) {
  window.innerWidth = width;
  render(
    <MemoryRouter initialEntries={['/clients']}>
      <UserProvider>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="*" element={<Page />} />
          </Route>
        </Routes>
      </UserProvider>
    </MemoryRouter>,
  );
  await screen.findByLabelText('Draft note');
}

const sidebarLink = () => screen.queryByRole('link', { name: 'Clients' });
const scrim = () => screen.queryByRole('button', { name: 'Dismiss sidebar' });
const openDrawer = () => fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

describe('ProtectedLayout sidebar', () => {
  beforeEach(() => {
    onPageMount.mockClear();
    localStorage.setItem(
      'tunix_selected_user',
      JSON.stringify({ userId: 'u1', user: { id: 'u1', email: 'a@b.c', role: 'Coach', first_name: 'A', last_name: 'B' } }),
    );
  });

  describe('below 1024px', () => {
    it('starts hidden and opens as a drawer over the content', async () => {
      await renderAt(820);
      expect(sidebarLink()).toBeNull();
      openDrawer();
      expect(sidebarLink()).toBeInTheDocument();
      expect(scrim()).toBeInTheDocument();
    });

    it('closes when a link is picked', async () => {
      await renderAt(768);
      openDrawer();
      fireEvent.click(sidebarLink()!);
      expect(sidebarLink()).toBeNull();
    });

    it('closes when the coach taps outside it', async () => {
      await renderAt(768);
      openDrawer();
      fireEvent.click(scrim()!);
      expect(sidebarLink()).toBeNull();
    });

    it('closes from its close button', async () => {
      await renderAt(768);
      openDrawer();
      fireEvent.click(screen.getByRole('button', { name: 'Close sidebar' }));
      expect(sidebarLink()).toBeNull();
    });
  });

  describe('from 1024 to 1279px', () => {
    it('starts as an icon rail and expands over the content', async () => {
      await renderAt(1180);
      expect(sidebarLink()).toBeInTheDocument();
      expect(screen.queryByText('Clients')).toBeNull();
      expect(scrim()).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
      expect(screen.getByText('Clients')).toBeInTheDocument();
      expect(screen.getByText('GJBR').closest('.fixed')).toBeInTheDocument();
      expect(scrim()).toBeInTheDocument();

      fireEvent.click(scrim()!);
      expect(screen.queryByText('Clients')).toBeNull();
    });
  });

  describe('from 1280px', () => {
    it('starts expanded, pushes the content and can collapse', async () => {
      await renderAt(1366);
      expect(screen.getByText('Clients')).toBeInTheDocument();
      expect(screen.getByText('GJBR').closest('.fixed')).toBeNull();
      expect(scrim()).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Close sidebar' }));
      expect(screen.queryByText('Clients')).toBeNull();
      expect(sidebarLink()).toBeInTheDocument();
    });

    it('stays open when a link is picked', async () => {
      await renderAt(1366);
      fireEvent.click(sidebarLink()!);
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });
  });

  it('takes the new default when rotation crosses a breakpoint', async () => {
    await renderAt(1366);
    expect(screen.getByText('Clients')).toBeInTheDocument();

    setWidth(1180);
    await waitFor(() => expect(screen.queryByText('Clients')).toBeNull());
    expect(sidebarLink()).toBeInTheDocument();

    setWidth(820);
    await waitFor(() => expect(sidebarLink()).toBeNull());

    openDrawer();
    setWidth(1180);
    await waitFor(() => expect(scrim()).toBeNull());
  });

  it('keeps the page mounted, and unsaved text, through every sidebar change', async () => {
    await renderAt(820);
    const draft = screen.getByLabelText('Draft note') as HTMLTextAreaElement;
    fireEvent.change(draft, { target: { value: 'unsaved recap' } });

    openDrawer();
    fireEvent.click(scrim()!);
    setWidth(1180);
    await waitFor(() => expect(sidebarLink()).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }));
    setWidth(1366);
    await waitFor(() => expect(scrim()).toBeNull());
    setWidth(820);
    await waitFor(() => expect(sidebarLink()).toBeNull());

    expect(onPageMount).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Draft note')).toBe(draft);
    expect(draft.value).toBe('unsaved recap');
  });
});

describe('Header menus', () => {
  beforeEach(() => {
    localStorage.setItem(
      'tunix_selected_user',
      JSON.stringify({ userId: 'u1', user: { id: 'u1', email: 'a@b.c', role: 'Coach', first_name: 'A', last_name: 'B' } }),
    );
  });

  it('close when the coach taps an empty area of the page', async () => {
    await renderAt(820);
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByText('Mark all as read')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Add New' }));
    expect(screen.getByText('New Client')).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByText('New Client')).toBeNull();
  });
});
