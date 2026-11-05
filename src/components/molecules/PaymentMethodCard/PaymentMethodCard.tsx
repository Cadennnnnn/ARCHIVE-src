
import type { SavedPaymentMethod } from '../../../types/user';

interface PaymentMethodCardProps {
  method: SavedPaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodCard({
  method,
  onSetDefault,
  onDelete,
}: PaymentMethodCardProps) {
  return (
    <article className="profile-card">
      <div className="profile-card__header">
        <div>
          <h3 className="profile-card__title">{method.marca}</h3>
          {method.isDefault && (
            <span className="profile-badge">Predeterminado</span>
          )}
        </div>
        <button
          className="profile-button profile-button--danger"
          type="button"
          onClick={() => onDelete(method.id)}
        >
          Eliminar
        </button>
      </div>

      <p>{method.tipo}</p>
      <p>•••• •••• •••• {method.ultimosCuatro}</p>
      <p>Titular: {method.titular}</p>
      <p>
        Vencimiento: {method.mesExpiracion}/{method.anioExpiracion}
      </p>

      {!method.isDefault && (
        <button
          className="profile-button"
          type="button"
          onClick={() => onSetDefault(method.id)}
        >
          Establecer como predeterminado
        </button>
      )}
    </article>
  );
}
