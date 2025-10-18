export type FieldErrors = Record<string, string>;

export function validateDocumento(documento: string): { valid: boolean; error?: string } {
  if (!documento || documento.trim() === '') return { valid: false, error: 'El documento es requerido' };
  return { valid: true };
}

export function validateNombres(nombres: string): { valid: boolean; error?: string } {
  if (!nombres || nombres.trim() === '') return { valid: false, error: 'Los nombres son requeridos' };
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim() === '') return { valid: false, error: 'El email es requerido' };
  // simple email check
  const re = /^\S+@\S+\.\S+$/;
  if (!re.test(email)) return { valid: false, error: 'Email inválido' };
  return { valid: true };
}

export function validateCelular(celular: string): { valid: boolean; error?: string } {
  if (!celular || celular.trim() === '') return { valid: false, error: 'El celular es requerido' };
  const digits = celular.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return { valid: false, error: 'Celular inválido' };
  return { valid: true };
}

export function validateAmount(value: number | string): { valid: boolean; error?: string } {
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num) || num <= 0) return { valid: false, error: 'El monto debe ser un número mayor que 0' };
  return { valid: true };
}

export function validateRegistro(form: { documento: string; nombres: string; email: string; celular: string; }): { valid: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const d = validateDocumento(form.documento); if (!d.valid) errors.documento = d.error!;
  const n = validateNombres(form.nombres); if (!n.valid) errors.nombres = n.error!;
  const e = validateEmail(form.email); if (!e.valid) errors.email = e.error!;
  const c = validateCelular(form.celular); if (!c.valid) errors.celular = c.error!;
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRecarga(form: { documento: string; celular: string; monto: number | string; }): { valid: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const d = validateDocumento(form.documento); if (!d.valid) errors.documento = d.error!;
  const c = validateCelular(form.celular); if (!c.valid) errors.celular = c.error!;
  const m = validateAmount(form.monto); if (!m.valid) errors.monto = m.error!;
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePagar(form: { documento: string; celular: string; monto: number | string; }): { valid: boolean; errors: FieldErrors } {
  // same as recarga for now
  return validateRecarga(form);
}

export function validateConsultarSaldo(form: { documento: string; celular: string; }): { valid: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const d = validateDocumento(form.documento); if (!d.valid) errors.documento = d.error!;
  const c = validateCelular(form.celular); if (!c.valid) errors.celular = c.error!;
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateToken(token: string): { valid: boolean; error?: string } {
  if (!token || token.trim() === '') {
    return { valid: false, error: 'El token es requerido' };
  }
  if (token.length !== 6 || isNaN(Number(token))) {
    return { valid: false, error: 'El token debe ser 6 dígitos' };
  }
  return { valid: true };
}

export function sanitizeTokenInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6);
}
