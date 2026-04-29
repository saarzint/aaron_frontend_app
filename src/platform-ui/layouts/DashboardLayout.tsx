import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: '220px',
          borderRight: '1px solid #e0e0e0',
          padding: '24px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '24px' }}>Platform</div>
        <div>Menu</div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            height: '60px',
            borderBottom: '1px solid #e0e0e0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          Topbar
        </header>

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
