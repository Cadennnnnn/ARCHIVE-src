

import { Link } from 'react-router-dom';

import { LoginForm } from '../../components/organisms/LoginForm/LoginForm';

export function LoginPage() {
  return (
    <section className="archive-auth-page container my-5">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <Link to="/" className="archive-auth-brand">
            ARCHIVE<span>[src]</span>
          </Link>

          <div className="archive-auth-card">
            <h1 className="h4 mb-4 text-center fw-bold">
              INICIO DE SESIÓN
            </h1>

            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
