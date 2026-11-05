
import { useState } from 'react';

import { useProfile } from '../../hooks/useProfile';

import {
  ProfileLayout,
  type ProfileSection,
} from '../../components/templates/ProfileLayout/ProfileLayout';

import { ProfilePersonalInfo } from '../../components/organisms/ProfilePersonalInfo/ProfilePersonalInfo';
import { ProfileAddresses } from '../../components/organisms/ProfileAddresses/ProfileAddresses';
import { ProfilePaymentMethods } from '../../components/organisms/ProfilePaymentMethods/ProfilePaymentMethods';
import { ProfileOrderHistory } from '../../components/organisms/ProfileOrderHistory/ProfileOrderHistory';
import '../../styles/components/profile.css';

export function ProfilePage() {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>('personal');

  const {
    user,
    addresses,
    paymentMethods,
    orders,
    isLoading,
    error,
    savePersonalInfo,
    addAddress,
    deleteAddress,
    makeDefaultAddress,
    addPaymentMethod,
    deletePaymentMethod,
    makeDefaultPaymentMethod,
  } = useProfile();

  if (isLoading) {
    return <p className="profile-empty">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="profile-empty">No se pudo cargar el perfil.</p>;
  }

  const personalData = {
    nombre: user.nombre,
    apellidos: user.profile?.apellidos ?? '',
    correo: user.correo,
    telefono: user.profile?.telefono ?? '',
  };

  return (
    <ProfileLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {error && <p className="profile-form__error">{error}</p>}

      {activeSection === 'personal' && (
        <ProfilePersonalInfo
          initialData={personalData}
          onSave={savePersonalInfo}
        />
      )}

      {activeSection === 'addresses' && (
        <ProfileAddresses
          addresses={addresses}
          onAdd={addAddress}
          onDelete={deleteAddress}
          onSetDefault={makeDefaultAddress}
        />
      )}

      {activeSection === 'payments' && (
        <ProfilePaymentMethods
          methods={paymentMethods}
          onAdd={addPaymentMethod}
          onDelete={deletePaymentMethod}
          onSetDefault={makeDefaultPaymentMethod}
        />
      )}

      {activeSection === 'orders' && (
        <ProfileOrderHistory orders={orders} />
      )}
    </ProfileLayout>
  );
}
