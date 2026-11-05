
import {
  createUser,
  createAdminUser,
  updateUser,
  getUsers,
  getPublicUsers,
  findUserByEmail,
  initializeUsers,
} from '../../src/services/userService';

import type {
  UserRegistrationData,
  User,
} from '../../src/types/user';

describe('userService', () => {
  const STORAGE_KEY = 'ARCHIVE_USERS';

  const validRegistration: UserRegistrationData = {
    nombre: 'Caden',
    apellidos: 'Prueba Usuario',
    correo: 'caden.prueba@gmail.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    run: '12345678-5',
    region: 'Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Principal 123',
  };

  const validAdmin = {
    run: '111111111',
    nombre: 'Administrador',
    apellidos: 'De Prueba',
    correo: 'admin.prueba@duoc.cl',
    rol: 'Administrador' as const,
  };

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  describe('initializeUsers y getUsers', () => {
    it('debe inicializar los usuarios demo cuando no existen datos', () => {
      const users = initializeUsers();

      expect(users.length).toBe(3);
      expect(users.some((user) => user.rol === 'Administrador')).toBeTrue();
      expect(users.some((user) => user.rol === 'Vendedor')).toBeTrue();
      expect(users.some((user) => user.rol === 'Cliente')).toBeTrue();
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    });

    it('debe recuperar usuarios almacenados y conservar los usuarios demo', () => {
      const storedUser: User = {
        id: 'custom-user',
        nombre: 'Usuario Guardado',
        correo: 'guardado@gmail.com',
        password: '1234',
        rol: 'Cliente',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify([storedUser]));

      const users = getUsers();

      expect(users.some((user) => user.id === 'custom-user')).toBeTrue();
      expect(users.length).toBe(4);
    });

    it('debe recuperar los usuarios demo cuando el JSON almacenado es inválido', () => {
      localStorage.setItem(STORAGE_KEY, '{json-invalido');

      const users = getUsers();

      expect(users.length).toBe(3);
    });
  });

  describe('findUserByEmail', () => {
    it('debe encontrar un usuario ignorando mayúsculas y espacios', () => {
      const user = findUserByEmail('  ADMIN@DUOC.CL  ');

      expect(user).toBeDefined();
      expect(user?.id).toBe('demo-admin');
    });

    it('debe devolver undefined cuando el correo no existe', () => {
      const user = findUserByEmail('inexistente@gmail.com');

      expect(user).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('debe registrar un cliente con sus datos normalizados', () => {
      const user = createUser(validRegistration);

      expect(user.nombre).toBe('Caden');
      expect(user.correo).toBe('caden.prueba@gmail.com');
      expect(user.rol).toBe('Cliente');
      expect(user.profile?.run).toBe('12345678-5');
      expect(user.profile?.apellidos).toBe('Prueba Usuario');

      const storedUsers = getUsers();

      expect(storedUsers.some((item) => item.id === user.id)).toBeTrue();
    });

    it('debe rechazar el registro de un correo duplicado', () => {
      createUser(validRegistration);

      expect(() =>
        createUser({
          ...validRegistration,
          run: '11222333-4',
        }),
      ).toThrowError('Ya existe una cuenta registrada con ese correo.');
    });

    it('debe rechazar el registro de un RUN duplicado', () => {
      createUser(validRegistration);

      expect(() =>
        createUser({
          ...validRegistration,
          correo: 'otro.usuario@gmail.com',
        }),
      ).toThrowError('Ya existe una cuenta registrada con ese RUN.');
    });

    it('debe guardar el correo y RUN normalizados', () => {
      const user = createUser({
        ...validRegistration,
        correo: '  NUEVO.USUARIO@GMAIL.COM ',
        run: ' 12345678-5 ',
      });

      expect(user.correo).toBe('nuevo.usuario@gmail.com');
      expect(user.profile?.run).toBe('12345678-5');
    });
  });

  describe('createAdminUser', () => {
    it('debe crear un usuario administrativo con los datos indicados', () => {
      const user = createAdminUser(validAdmin);

      expect(user.nombre).toBe('Administrador');
      expect(user.correo).toBe('admin.prueba@duoc.cl');
      expect(user.rol).toBe('Administrador');
      expect(user.password).toBe('1234');
      expect(user.profile?.run).toBe('111111111');
    });

    it('debe rechazar un RUN inválido', () => {
      expect(() =>
        createAdminUser({
          ...validAdmin,
          run: 'INVALIDO',
        }),
      ).toThrowError(
        'El RUN debe tener entre 7 y 9 caracteres sin puntos ni guion.',
      );
    });

    it('debe rechazar un nombre vacío', () => {
      expect(() =>
        createAdminUser({
          ...validAdmin,
          nombre: '   ',
        }),
      ).toThrowError(
        'El nombre es obligatorio y no puede superar los 50 caracteres.',
      );
    });

    it('debe rechazar un correo con dominio no autorizado', () => {
      expect(() =>
        createAdminUser({
          ...validAdmin,
          correo: 'admin@hotmail.com',
        }),
      ).toThrowError(
        'Solo se autorizan cuentas @duoc.cl, @profesor.duoc.cl o @gmail.com.',
      );
    });

    it('debe rechazar un correo administrativo duplicado', () => {
      createAdminUser(validAdmin);

      expect(() =>
        createAdminUser(validAdmin),
      ).toThrowError('Ya existe una cuenta registrada con ese correo.');
    });

    it('debe rechazar un RUN administrativo duplicado', () => {
      createAdminUser(validAdmin);

      expect(() =>
        createAdminUser({
          ...validAdmin,
          correo: 'otro.admin@gmail.com',
        }),
      ).toThrowError('Ya existe una cuenta registrada con ese RUN.');
    });
  });

  describe('updateUser', () => {
    it('debe actualizar los datos personales de un usuario', () => {
      const user = createUser(validRegistration);

      const updatedUser = updateUser(user.id, {
        nombre: 'Nombre Actualizado',
        apellidos: 'Apellidos Actualizados',
        correo: 'actualizado@gmail.com',
        telefono: '+56912345678',
      });

      expect(updatedUser.nombre).toBe('Nombre Actualizado');
      expect(updatedUser.profile?.apellidos).toBe('Apellidos Actualizados');
      expect(updatedUser.correo).toBe('actualizado@gmail.com');
      expect(updatedUser.profile?.telefono).toBe('+56912345678');
      expect(updatedUser.password).toBe(validRegistration.password);
    });

    it('debe rechazar la actualización de un usuario inexistente', () => {
      expect(() =>
        updateUser('usuario-inexistente', {
          nombre: 'Nombre',
          apellidos: 'Apellidos',
          correo: 'usuario@gmail.com',
          telefono: '912345678',
        }),
      ).toThrowError('No se encontró el usuario.');
    });

    it('debe rechazar un nombre vacío', () => {
      const user = createUser(validRegistration);

      expect(() =>
        updateUser(user.id, {
          nombre: ' ',
          apellidos: 'Apellidos',
          correo: 'actualizado@gmail.com',
          telefono: '912345678',
        }),
      ).toThrowError(
        'El nombre es obligatorio y no puede superar los 50 caracteres.',
      );
    });

    it('debe rechazar un correo que pertenece a otro usuario', () => {
      const firstUser: User = {
        id: 'test-user-1',
        nombre: 'Primer Usuario',
        correo: 'primer.usuario@gmail.com',
        password: 'Password123',
        rol: 'Cliente',
        profile: {
          run: '12345678-5',
          apellidos: 'Primero',
          region: 'Metropolitana',
          comuna: 'Santiago',
          direccion: 'Primera dirección',
        },
      };

      const secondUser: User = {
        id: 'test-user-2',
        nombre: 'Segundo Usuario',
        correo: 'segundo.usuario@gmail.com',
        password: 'Password123',
        rol: 'Cliente',
        profile: {
          run: '11222333-4',
          apellidos: 'Segundo',
          region: 'Metropolitana',
          comuna: 'Santiago',
          direccion: 'Segunda dirección',
        },
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([firstUser, secondUser]),
      );

      expect(() =>
        updateUser(secondUser.id, {
          nombre: 'Segundo',
          apellidos: 'Usuario',
          correo: firstUser.correo,
          telefono: '912345678',
        }),
      ).toThrowError(
        'Ya existe otra cuenta registrada con ese correo.',
      );
    });

    it('debe conservar los datos del perfil que no se están actualizando', () => {
      const user = createUser(validRegistration);

      const updatedUser = updateUser(user.id, {
        nombre: 'Nombre Nuevo',
        apellidos: 'Apellidos Nuevos',
        correo: 'nuevo.correo@gmail.com',
        telefono: '912345678',
      });

      expect(updatedUser.profile?.run).toBe(validRegistration.run);
      expect(updatedUser.profile?.region).toBe(validRegistration.region);
      expect(updatedUser.profile?.comuna).toBe(validRegistration.comuna);
      expect(updatedUser.profile?.direccion).toBe(validRegistration.direccion);
    });
  });

  describe('getPublicUsers', () => {
    it('debe devolver usuarios sin exponer sus contraseñas', () => {
      createUser(validRegistration);

      const publicUsers = getPublicUsers();

      expect(publicUsers.length).toBeGreaterThan(0);

      publicUsers.forEach((user) => {
        expect('password' in user).toBeFalse();
      });
    });

    it('debe conservar los datos públicos del perfil', () => {
      createUser(validRegistration);

      const publicUser = getPublicUsers().find(
        (user) => user.correo === validRegistration.correo,
      );

      expect(publicUser).toBeDefined();
      expect(publicUser?.profile?.run).toBe(validRegistration.run);
      expect(publicUser?.profile?.apellidos).toBe(validRegistration.apellidos);
    });
  });
});
