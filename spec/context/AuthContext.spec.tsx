
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

import { AuthProvider } from '../../src/context/AuthContext';
import { useAuth } from '../../src/hooks/useAuth';
import { authenticate } from '../../src/services/authService';
import { initializeUsers } from '../../src/services/userService';

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

function AuthTestComponent() {
  const {
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateAccount,
  } = useAuth();

  const [message, setMessage] = useState('');

  const handleLogin = async (
    correo: string,
    password: string,
  ) => {
    try {
      await login({ correo, password });
      setMessage('Login exitoso');
    } catch {
      setMessage('Login rechazado');
    }
  };

  const handleUpdate = () => {
    try {
      updateAccount({
        nombre: 'Cliente Actualizado',
        apellidos: 'Apellido Actualizado',
        correo: 'cliente.actualizado@gmail.com',
        telefono: '+56912345678',
      });

      setMessage('Cuenta actualizada');
    } catch {
      setMessage('Error al actualizar');
    }
  };

  return (
    <div>
      <p data-testid="authenticated">
        {String(isAuthenticated)}
      </p>

      <p data-testid="loading">
        {String(isLoading)}
      </p>

      <p data-testid="user-name">
        {session?.user.nombre ?? 'Sin sesión'}
      </p>

      <p data-testid="user-email">
        {session?.user.correo ?? 'Sin correo'}
      </p>

      <p data-testid="user-role">
        {session?.role ?? 'Sin rol'}
      </p>

      <p data-testid="message">{message}</p>

      <button
        onClick={() =>
          void handleLogin('cliente@gmail.com', '1234')
        }
      >
        Iniciar sesión
      </button>

      <button
        onClick={() =>
          void handleLogin('cliente@gmail.com', 'incorrecta')
        }
      >
        Iniciar sesión con credenciales incorrectas
      </button>

      <button onClick={logout}>
        Cerrar sesión
      </button>

      <button onClick={handleUpdate}>
        Actualizar cuenta
      </button>
    </div>
  );
}

describe('Pruebas de AuthContext', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();

    container = document.createElement('div');
    document.body.appendChild(container);

    root = createRoot(container);

    initializeUsers();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
    localStorage.clear();
  });

  const renderProvider = () => {
    act(() => {
      root.render(
        <AuthProvider>
          <AuthTestComponent />
        </AuthProvider>,
      );
    });
  };

  const getButton = (label: string): HTMLButtonElement => {
    const button = Array.from(
      container.querySelectorAll('button'),
    ).find((item) => item.textContent === label);

    if (!button) {
      throw new Error(`No se encontró el botón: ${label}`);
    }

    return button;
  };

  const getText = (testId: string): string => {
    const element = container.querySelector(
      `[data-testid="${testId}"]`,
    );

    return element?.textContent ?? '';
  };

  it('debe iniciar sin una sesión autenticada', () => {
    renderProvider();

    expect(getText('authenticated')).toBe('false');
    expect(getText('user-name')).toBe('Sin sesión');
    expect(getText('user-role')).toBe('Sin rol');
  });

  it('debe iniciar sesión con credenciales válidas', async () => {
    renderProvider();

    await act(async () => {
      getButton('Iniciar sesión').click();
    });

    expect(getText('authenticated')).toBe('true');
    expect(getText('user-name')).toBe('Cliente');
    expect(getText('user-role')).toBe('Cliente');
    expect(getText('message')).toBe('Login exitoso');

    expect(
      localStorage.getItem('ARCHIVE_AUTH_SESSION'),
    ).not.toBeNull();
  });

  it('debe rechazar credenciales incorrectas', async () => {
    renderProvider();

    await act(async () => {
      getButton(
        'Iniciar sesión con credenciales incorrectas',
      ).click();
    });

    expect(getText('authenticated')).toBe('false');
    expect(getText('user-name')).toBe('Sin sesión');
    expect(getText('message')).toBe('Login rechazado');

    expect(
      localStorage.getItem('ARCHIVE_AUTH_SESSION'),
    ).toBeNull();
  });

  it('debe cerrar la sesión y limpiar los datos persistidos', async () => {
    renderProvider();

    await act(async () => {
      getButton('Iniciar sesión').click();
    });

    act(() => {
      getButton('Cerrar sesión').click();
    });

    expect(getText('authenticated')).toBe('false');
    expect(getText('user-name')).toBe('Sin sesión');

    expect(
      localStorage.getItem('ARCHIVE_AUTH_SESSION'),
    ).toBeNull();

    expect(
      localStorage.getItem('ARCHIVE_AUTH_ROLE'),
    ).toBeNull();

    expect(
      localStorage.getItem('ARCHIVE_USER_EMAIL'),
    ).toBeNull();

    expect(
      localStorage.getItem('ARCHIVE_USER_NAME'),
    ).toBeNull();
  });

  it('debe recuperar una sesión previamente persistida', () => {
    authenticate('cliente@gmail.com', '1234');

    renderProvider();

    expect(getText('authenticated')).toBe('true');
    expect(getText('user-name')).toBe('Cliente');
    expect(getText('user-role')).toBe('Cliente');
  });

  it('debe actualizar los datos de la cuenta y la sesión', () => {
    authenticate('cliente@gmail.com', '1234');

    renderProvider();

    act(() => {
      getButton('Actualizar cuenta').click();
    });

    expect(getText('authenticated')).toBe('true');
    expect(getText('user-name')).toBe('Cliente Actualizado');
    expect(getText('user-email')).toBe(
      'cliente.actualizado@gmail.com',
    );

    expect(getText('message')).toBe('Cuenta actualizada');

    const storedSession = JSON.parse(
      localStorage.getItem('ARCHIVE_AUTH_SESSION') ?? '{}',
    );

    expect(storedSession.user.nombre).toBe(
      'Cliente Actualizado',
    );

    expect(storedSession.user.correo).toBe(
      'cliente.actualizado@gmail.com',
    );
  });

  it('debe mantener el estado de carga desactivado después de inicializarse', () => {
    renderProvider();

    expect(getText('loading')).toBe('false');
  });
});
