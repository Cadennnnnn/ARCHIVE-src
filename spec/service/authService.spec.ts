
import {
  authenticate,
  getCurrentSession,
  refreshSession,
  clearSession,
} from '../../src/services/authService';

import { createUser } from '../../src/services/userService';

import type { UserRegistrationData } from '../../src/types/user';

describe('authService', () => {
  const AUTH_SESSION_KEY = 'ARCHIVE_AUTH_SESSION';
  const AUTH_ROLE_KEY = 'ARCHIVE_AUTH_ROLE';
  const USER_EMAIL_KEY = 'ARCHIVE_USER_EMAIL';
  const USER_NAME_KEY = 'ARCHIVE_USER_NAME';
  const USERS_KEY = 'ARCHIVE_USERS';

  const validRegistration: UserRegistrationData = {
    nombre: 'Usuario',
    apellidos: 'Prueba',
    correo: 'auth.prueba@gmail.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    run: '12345678-5',
    region: 'Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Principal 123',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  function createTestUser() {
    return createUser(validRegistration);
  }

  function expectSessionStorage(
    correo: string,
    nombre: string,
    role: string,
  ): void {
    expect(localStorage.getItem(AUTH_ROLE_KEY)).toBe(role);
    expect(localStorage.getItem(USER_EMAIL_KEY)).toBe(correo);
    expect(localStorage.getItem(USER_NAME_KEY)).toBe(nombre);
    expect(localStorage.getItem(AUTH_SESSION_KEY)).not.toBeNull();
  }

  describe('authenticate', () => {
    it('debe autenticar un usuario con credenciales correctas', () => {
      const user = createTestUser();

      const session = authenticate(
        user.correo,
        validRegistration.password,
      );

      expect(session).not.toBeNull();
      expect(session?.user.id).toBe(user.id);
      expect(session?.user.correo).toBe(user.correo);
      expect(session?.user.nombre).toBe(user.nombre);
      expect(session?.role).toBe('Cliente');
    });

    it('debe persistir la sesión después de autenticar', () => {
      const user = createTestUser();

      authenticate(user.correo, validRegistration.password);

      expectSessionStorage(
        user.correo,
        user.nombre,
        'Cliente',
      );
    });

    it('no debe incluir la contraseña en la sesión', () => {
      const user = createTestUser();

      const session = authenticate(
        user.correo,
        validRegistration.password,
      );

      expect(session).not.toBeNull();
      expect('password' in session!.user).toBeFalse();
    });

    it('debe rechazar una contraseña incorrecta', () => {
      const user = createTestUser();

      const session = authenticate(
        user.correo,
        'PasswordIncorrecta',
      );

      expect(session).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it('debe rechazar un correo inexistente', () => {
      const session = authenticate(
        'inexistente@gmail.com',
        'Password123',
      );

      expect(session).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });
  });

  describe('getCurrentSession', () => {
    it('debe devolver null cuando no existe una sesión almacenada', () => {
      const session = getCurrentSession();

      expect(session).toBeNull();
    });

    it('debe recuperar una sesión válida almacenada', () => {
      const user = createTestUser();

      authenticate(user.correo, validRegistration.password);

      const session = getCurrentSession();

      expect(session).not.toBeNull();
      expect(session?.user.id).toBe(user.id);
      expect(session?.user.correo).toBe(user.correo);
      expect(session?.role).toBe('Cliente');
    });

    it('debe rechazar y limpiar una sesión con JSON inválido', () => {
      localStorage.setItem(AUTH_SESSION_KEY, '{json-invalido');
      localStorage.setItem(AUTH_ROLE_KEY, 'Cliente');
      localStorage.setItem(USER_EMAIL_KEY, 'usuario@gmail.com');
      localStorage.setItem(USER_NAME_KEY, 'Usuario');

      const session = getCurrentSession();

      expect(session).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
      expect(localStorage.getItem(AUTH_ROLE_KEY)).toBeNull();
      expect(localStorage.getItem(USER_EMAIL_KEY)).toBeNull();
      expect(localStorage.getItem(USER_NAME_KEY)).toBeNull();
    });

    it('debe limpiar una sesión con estructura inválida', () => {
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({
          user: {
            id: 'user-1',
            correo: 'usuario@gmail.com',
            nombre: 'Usuario',
          },
          role: 'RolInvalido',
        }),
      );

      const session = getCurrentSession();

      expect(session).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it('debe limpiar una sesión cuando el usuario ya no existe', () => {
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({
          user: {
            id: 'usuario-eliminado',
            correo: 'eliminado@gmail.com',
            nombre: 'Usuario Eliminado',
            rol: 'Cliente',
          },
          role: 'Cliente',
        }),
      );

      const session = getCurrentSession();

      expect(session).toBeNull();
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    });

    it('debe actualizar los datos de la sesión con la información almacenada del usuario', () => {
      const user = createTestUser();

      authenticate(user.correo, validRegistration.password);

      const updatedUser = {
        ...user,
        nombre: 'Nombre Actualizado',
      };

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([updatedUser]),
      );

      const session = getCurrentSession();

      expect(session?.user.nombre).toBe('Nombre Actualizado');
      expect(localStorage.getItem(USER_NAME_KEY)).toBe(
        'Nombre Actualizado',
      );
    });
  });

  describe('refreshSession', () => {
    it('debe crear y persistir una sesión actualizada', () => {
      const user = createTestUser();

      const session = refreshSession(user);

      expect(session.user.id).toBe(user.id);
      expect(session.user.correo).toBe(user.correo);
      expect(session.role).toBe('Cliente');

      expectSessionStorage(
        user.correo,
        user.nombre,
        'Cliente',
      );
    });

    it('debe excluir la contraseña al actualizar la sesión', () => {
      const user = createTestUser();

      const session = refreshSession(user);

      expect('password' in session.user).toBeFalse();
    });
  });

  describe('clearSession', () => {
    it('debe eliminar todos los datos de autenticación almacenados', () => {
      const user = createTestUser();

      authenticate(user.correo, validRegistration.password);

      clearSession();

      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
      expect(localStorage.getItem(AUTH_ROLE_KEY)).toBeNull();
      expect(localStorage.getItem(USER_EMAIL_KEY)).toBeNull();
      expect(localStorage.getItem(USER_NAME_KEY)).toBeNull();
    });

    it('debe poder ejecutarse aunque no exista una sesión', () => {
      expect(() => clearSession()).not.toThrow();

      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
      expect(localStorage.getItem(AUTH_ROLE_KEY)).toBeNull();
    });
  });
});
