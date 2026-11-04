
import {
  validateEmail,
  validatePassword,
  validateRun,
  validateChileanMobilePhone,
  normalizeChileanMobilePhone,
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

  describe('validateChileanMobilePhone', () => {
    it('debe aceptar números móviles chilenos sin prefijo', () => {
      expect(validateChileanMobilePhone('912345678')).toBeTrue();
    });

    it('debe aceptar números con prefijo 56', () => {
      expect(validateChileanMobilePhone('56912345678')).toBeTrue();
    });

    it('debe aceptar números con prefijo internacional +56', () => {
      expect(validateChileanMobilePhone('+56912345678')).toBeTrue();
    });

    it('debe aceptar espacios y guiones como separadores', () => {
      expect(validateChileanMobilePhone('+56 9 1234 5678')).toBeTrue();
      expect(validateChileanMobilePhone('9-1234-5678')).toBeTrue();
    });

    it('debe rechazar números incompletos o con formato inválido', () => {
      expect(validateChileanMobilePhone('123456789')).toBeFalse();
      expect(validateChileanMobilePhone('91234567')).toBeFalse();
      expect(validateChileanMobilePhone('+5691234567')).toBeFalse();
      expect(validateChileanMobilePhone('+54912345678')).toBeFalse();
    });
  });

  describe('normalizeChileanMobilePhone', () => {
    it('debe normalizar números al formato +56', () => {
      expect(normalizeChileanMobilePhone('912345678')).toBe(
        '+56912345678',
      );
      expect(normalizeChileanMobilePhone('56912345678')).toBe(
        '+56912345678',
      );
      expect(normalizeChileanMobilePhone('+56 9 1234 5678')).toBe(
        '+56912345678',
      );
    });

    it('debe devolver null para números inválidos', () => {
      expect(normalizeChileanMobilePhone('123456789')).toBeNull();
      expect(normalizeChileanMobilePhone('')).toBeNull();
    });
  });
});
