
import type { ShippingAddress } from '../../../types/user';

interface AddressCardProps {
  address: ShippingAddress;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AddressCard({
  address,
  onSetDefault,
  onDelete,
}: AddressCardProps) {
  return (
    <article className="profile-card">
      <div className="profile-card__header">
        <div>
          <h3 className="profile-card__title">{address.alias}</h3>
          {address.isDefault && (
            <span className="profile-badge">Predeterminada</span>
          )}
        </div>
        <button
          className="profile-button profile-button--danger"
          type="button"
          onClick={() => onDelete(address.id)}
        >
          Eliminar
        </button>
      </div>

      <p>
        {address.nombre} {address.apellidos}
      </p>
      <p>{address.direccion}</p>
      {address.departamento && <p>{address.departamento}</p>}
      <p>
        {address.comuna}, {address.region}
      </p>
      <p>Teléfono: {address.telefono}</p>

      {address.indicaciones && (
        <p className="profile-card__muted">
          Indicaciones: {address.indicaciones}
        </p>
      )}

      {!address.isDefault && (
        <button
          className="profile-button"
          type="button"
          onClick={() => onSetDefault(address.id)}
        >
          Establecer como predeterminada
        </button>
      )}
    </article>
  );
}
