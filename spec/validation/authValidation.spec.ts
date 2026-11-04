
import {
  validateEmail,
  validatePassword,
  validateRun,
} from '../../src/utils/validation/authValidation';

describe('Auth Validation', () => {
  describe('validateRun', () => {
    it('debe aceptar un RUN válido de 9 caracteres', () => {
      expect(validateRun('19011022K')).toBeTrue();
    });

    it('debe rechazar un RUN con puntos o guion', () => {
      expect(validateRun('19.011.022-K')).toBeFalse();
    });
  });

  describe('validateEmail', () => {
    it('debe aceptar correos de dominios autorizados', () => {
      expect(validateEmail('usuario@duoc.cl')).toBeTrue();
      expect(validateEmail('docente@profesor.duoc.cl')).toBeTrue();
      expect(validateEmail('usuario@gmail.com')).toBeTrue();
    });

    it('debe rechazar correos de dominios no autorizados', () => {
      expect(validateEmail('usuario@hotmail.com')).toBeFalse();
      expect(validateEmail('usuario@example.org')).toBeFalse();
    });
  });

  describe('validatePassword', () => {
    it('debe aceptar contraseñas alfanuméricas de 4 a 10 caracteres', () => {
      expect(validatePassword('1234')).toBeTrue();
      expect(validatePassword('Archive123')).toBeTrue();
    });

    it('debe rechazar contraseñas fuera del rango permitido', () => {
      expect(validatePassword('123')).toBeFalse();
      expect(validatePassword('12345678901')).toBeFalse();
    });

    it('debe rechazar caracteres especiales', () => {
      expect(validatePassword('abc@123')).toBeFalse();
    });
  });
});