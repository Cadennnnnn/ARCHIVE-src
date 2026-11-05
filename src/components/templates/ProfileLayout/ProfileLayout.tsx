import type { ReactNode } from 'react';

export type ProfileSection =
  | 'personal'
  | 'addresses'
  | 'payments'
  | 'orders';

interface ProfileLayoutProps {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
  children: ReactNode;
}

const sections: { id: ProfileSection; label: string }[] = [
  { id: 'personal', label: 'Datos personales' },
  { id: 'addresses', label: 'Direcciones' },
  { id: 'payments', label: 'Métodos de pago' },
  { id: 'orders', label: 'Mis pedidos' },
];

export function ProfileLayout({
  activeSection,
  onSectionChange,
  children,
}: ProfileLayoutProps) {
  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <p className="profile-page__eyebrow">MI CUENTA</p>
        <h1>Mi perfil</h1>
        <p>Administra tus datos personales y preferencias de compra.</p>
      </header>

      <nav className="profile-navigation" aria-label="Secciones del perfil">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`profile-navigation__item ${
              activeSection === section.id
                ? 'profile-navigation__item--active'
                : ''
            }`}
            aria-current={activeSection === section.id ? 'page' : undefined}
            onClick={() => onSectionChange(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <main className="profile-page__content">{children}</main>
    </div>
  );
}
