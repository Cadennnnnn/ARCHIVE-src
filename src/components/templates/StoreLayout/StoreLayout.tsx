// Archivo: src/components/templates/StoreLayout/StoreLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '../../organisms/Header/Header';
import { Footer } from '../../organisms/Footer/Footer';

export function StoreLayout() {
  return (
    <>
      <Header />
      <main className="archive-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
