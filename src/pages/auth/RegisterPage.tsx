

import { Link } from 'react-router-dom';

import { RegisterForm } from '../../components/organisms/RegisterForm/RegisterForm';

export function RegisterPage() {
  return (
    <section className="archive-auth-page container my-5">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <Link to="/" className="archive-auth-brand">
            ARCHIVE<span>[src]</span>
          </Link>

          <div className="archive-auth-card">
            <h1 className="h4 mb-4 text-center fw-bold">
              REGISTRO DE USUARIO
            </h1>

            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
