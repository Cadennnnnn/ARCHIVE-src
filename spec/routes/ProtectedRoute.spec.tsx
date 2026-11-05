
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { AuthProvider } from '../../src/context/AuthContext';
import { ProtectedRoute } from '../../src/routes/ProtectedRoute';

import { authenticate } from '../../src/services/authService';
import { initializeUsers } from '../../src/services/userService';

import type { UserRole } from '../../src/types/user';

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

describe('Pruebas de ProtectedRoute', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    initializeUsers();

    container = document.createElement('div');
    document.body.appendChild(container);

    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
    localStorage.clear();
  });

  const renderRoute = (
    path: string,
    allowedRoles: UserRole[],
    credentials?: {
      correo: string;
      password: string;
    },
  ) => {
    if (credentials) {
      authenticate(
        credentials.correo,
        credentials.password,
      );
    }

    act(() => {
      root.render(
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                element={<p>Página de inicio de sesión</p>}
              />

              <Route
                path="/"
                element={<p>Página principal</p>}
              />

              <Route
                element={
                  <ProtectedRoute allowedRoles={allowedRoles} />
                }
              >
                <Route
                  path="/privado"
                  element={<p>Contenido protegido</p>}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </MemoryRouter>,
      );
    });
  };

  it('debe redirigir al login cuando no existe una sesión', () => {
    renderRoute('/privado', ['Cliente']);

    expect(container.textContent).toContain(
      'Página de inicio de sesión',
    );

    expect(container.textContent).not.toContain(
      'Contenido protegido',
    );
  });

  it('debe permitir el acceso a un cliente autorizado', () => {
    renderRoute('/privado', ['Cliente'], {
      correo: 'cliente@gmail.com',
      password: '1234',
    });

    expect(container.textContent).toContain(
      'Contenido protegido',
    );
  });

  it('debe impedir que un cliente acceda a una ruta administrativa', () => {
    renderRoute('/privado', ['Administrador'], {
      correo: 'cliente@gmail.com',
      password: '1234',
    });

    expect(container.textContent).toContain(
      'Página principal',
    );

    expect(container.textContent).not.toContain(
      'Contenido protegido',
    );
  });

  it('debe permitir el acceso a un administrador', () => {
    renderRoute('/privado', ['Administrador'], {
      correo: 'admin@duoc.cl',
      password: '1234',
    });

    expect(container.textContent).toContain(
      'Contenido protegido',
    );
  });

  it('debe permitir el acceso a un vendedor cuando su rol está autorizado', () => {
    renderRoute('/privado', ['Administrador', 'Vendedor'], {
      correo: 'vendedor@duoc.cl',
      password: '1234',
    });

    expect(container.textContent).toContain(
      'Contenido protegido',
    );
  });

  it('debe impedir que un vendedor acceda a una ruta exclusiva de administrador', () => {
    renderRoute('/privado', ['Administrador'], {
      correo: 'vendedor@duoc.cl',
      password: '1234',
    });

    expect(container.textContent).toContain(
      'Página principal',
    );

    expect(container.textContent).not.toContain(
      'Contenido protegido',
    );
  });
});
