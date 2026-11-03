
import type {
  User,
  UserRegistrationData,
} from '../types/user';

const USERS_STORAGE_KEY = 'ARCHIVE_USERS';

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
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function initializeUsers(): User[] {
  const storedUsers = readStoredUsers();

  const initializedUsers = [...storedUsers];

  DEMO_USERS.forEach((demoUser) => {
    const alreadyExists = initializedUsers.some(
      (user) => user.correo.toLowerCase() === demoUser.correo,
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

export function findUserByEmail(email: string): User | undefined {
  const normalizedEmail = email.trim().toLowerCase();

  return getUsers().find(
    (user) => user.correo.toLowerCase() === normalizedEmail,
  );
}

export function createUser(data: UserRegistrationData): User {
  const users = getUsers();
  const normalizedEmail = data.correo.trim().toLowerCase();

  const emailExists = users.some(
    (user) => user.correo.toLowerCase() === normalizedEmail,
  );

  if (emailExists) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }

  const runExists = users.some(
    (user) => user.profile?.run === data.run.trim().toUpperCase(),
  );

  if (runExists) {
    throw new Error('Ya existe una cuenta registrada con ese RUN.');
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

export function getPublicUsers() {
  return getUsers().map(({ password: _password, ...user }) => user);
}