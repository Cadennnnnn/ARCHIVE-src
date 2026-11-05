
import type {
  User,
  UserRegistrationData,
  UserRole,
  PublicUser,
  UserProfileUpdateData,
} from '../types/user';

import {
  validateEmail,
  validateRun,
} from '../utils/validation/authValidation';

const USERS_STORAGE_KEY = 'ARCHIVE_USERS';

export interface AdminUserData {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: UserRole;
}

const DEMO_USERS: User[] = [
  {
    id: 'demo-admin',
    nombre: 'Admin General',
    correo: 'admin@duoc.cl',
    password: '1234',
    rol: 'Administrador',
  },
  {
    id: 'demo-seller',
    nombre: 'Vendedor Turno',
    correo: 'vendedor@duoc.cl',
    password: '1234',
    rol: 'Vendedor',
  },
  {
    id: 'demo-client',
    nombre: 'Cliente',
    correo: 'cliente@gmail.com',
    password: '1234',
    rol: 'Cliente',
  },
];

function readStoredUsers(): User[] {
  try {
    const storedData = localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.filter(
      (user): user is User =>
        typeof user === 'object' &&
        user !== null &&
        'correo' in user &&
        'password' in user &&
        'rol' in user,
    );
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users),
  );
}

export function initializeUsers(): User[] {
  const storedUsers = readStoredUsers();
  const initializedUsers = [...storedUsers];

  DEMO_USERS.forEach((demoUser) => {
    const alreadyExists = initializedUsers.some(
      (user) =>
        user.correo.toLowerCase() === demoUser.correo,
    );

    if (!alreadyExists) {
      initializedUsers.push(demoUser);
    }
  });

  saveUsers(initializedUsers);

  return initializedUsers;
}

export function getUsers(): User[] {
  return initializeUsers();
}

export function findUserByEmail(
  email: string,
): User | undefined {
  const normalizedEmail = email.trim().toLowerCase();

  return getUsers().find(
    (user) =>
      user.correo.toLowerCase() === normalizedEmail,
  );
}

export function createUser(
  data: UserRegistrationData,
): User {
  const users = getUsers();
  const normalizedEmail = data.correo.trim().toLowerCase();

  const emailExists = users.some(
    (user) =>
      user.correo.toLowerCase() === normalizedEmail,
  );

  if (emailExists) {
    throw new Error(
      'Ya existe una cuenta registrada con ese correo.',
    );
  }

  const runExists = users.some(
    (user) =>
      user.profile?.run === data.run.trim().toUpperCase(),
  );

  if (runExists) {
    throw new Error(
      'Ya existe una cuenta registrada con ese RUN.',
    );
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    nombre: data.nombre.trim(),
    correo: normalizedEmail,
    password: data.password,
    rol: 'Cliente',
    profile: {
      run: data.run.trim().toUpperCase(),
      apellidos: data.apellidos.trim(),
      region: data.region,
      comuna: data.comuna,
      direccion: data.direccion.trim(),
    },
  };

  saveUsers([...users, newUser]);

  return newUser;
}

export function createAdminUser(
  data: AdminUserData,
): User {
  const users = getUsers();
  const normalizedEmail = data.correo.trim().toLowerCase();
  const normalizedRun = data.run.trim().toUpperCase();

  if (!validateRun(normalizedRun)) {
    throw new Error(
      'El RUN debe tener entre 7 y 9 caracteres sin puntos ni guion.',
    );
  }

  if (!data.nombre.trim() || data.nombre.trim().length > 50) {
    throw new Error(
      'El nombre es obligatorio y no puede superar los 50 caracteres.',
    );
  }

  if (
    !data.apellidos.trim() ||
    data.apellidos.trim().length > 100
  ) {
    throw new Error(
      'Los apellidos son obligatorios y no pueden superar los 100 caracteres.',
    );
  }

  if (!validateEmail(normalizedEmail)) {
    throw new Error(
      'Solo se autorizan cuentas @duoc.cl, @profesor.duoc.cl o @gmail.com.',
    );
  }

  if (
    users.some(
      (user) => user.correo.toLowerCase() === normalizedEmail,
    )
  ) {
    throw new Error(
      'Ya existe una cuenta registrada con ese correo.',
    );
  }

  if (
    users.some(
      (user) =>
        user.profile?.run?.toUpperCase() === normalizedRun,
    )
  ) {
    throw new Error(
      'Ya existe una cuenta registrada con ese RUN.',
    );
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    nombre: data.nombre.trim(),
    correo: normalizedEmail,
    password: '1234',
    rol: data.rol,
    profile: {
      run: normalizedRun,
      apellidos: data.apellidos.trim(),
      region: '',
      comuna: '',
      direccion: '',
    },
  };

  saveUsers([...users, newUser]);

  return newUser;
}

export function updateUser(
  userId: string,
  data: UserProfileUpdateData,
): User {
  const users = getUsers();

  const userIndex = users.findIndex(
    (user) => user.id === userId,
  );

  if (userIndex === -1) {
    throw new Error('No se encontró el usuario.');
  }

  const normalizedEmail = data.correo.trim().toLowerCase();
  const normalizedName = data.nombre.trim();
  const normalizedSurnames = data.apellidos.trim();
  const normalizedPhone = data.telefono.trim();

  if (!normalizedName || normalizedName.length > 50) {
    throw new Error(
      'El nombre es obligatorio y no puede superar los 50 caracteres.',
    );
  }

  if (
    !normalizedSurnames ||
    normalizedSurnames.length > 100
  ) {
    throw new Error(
      'Los apellidos son obligatorios y no pueden superar los 100 caracteres.',
    );
  }

  if (!validateEmail(normalizedEmail)) {
    throw new Error(
      'El correo ingresado no tiene un formato o dominio autorizado.',
    );
  }

  const emailExists = users.some(
    (user) =>
      user.id !== userId &&
      user.correo.toLowerCase() === normalizedEmail,
  );

  if (emailExists) {
    throw new Error(
      'Ya existe otra cuenta registrada con ese correo.',
    );
  }

  const updatedUser: User = {
    ...users[userIndex],
    nombre: normalizedName,
    correo: normalizedEmail,
    profile: {
      run: users[userIndex].profile?.run ?? '',
      region: users[userIndex].profile?.region ?? '',
      comuna: users[userIndex].profile?.comuna ?? '',
      direccion: users[userIndex].profile?.direccion ?? '',
      ...users[userIndex].profile,
      apellidos: normalizedSurnames,
      telefono: normalizedPhone,
    },
  };

  const updatedUsers = [...users];
  updatedUsers[userIndex] = updatedUser;

  saveUsers(updatedUsers);

  return updatedUser;
}

export function getPublicUsers(): PublicUser[] {
  return getUsers().map((user): PublicUser => ({
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
    ...(user.profile ? { profile: user.profile } : {}),
  }));
}
