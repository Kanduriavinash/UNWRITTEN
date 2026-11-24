// Campus security, input sanitization and verification utilities for UNWRITTEN

/**
 * Strict Campus Roll Number Validator
 * Enforces the university format: AM.XX.XXXXXXXXXX
 * Example: AM.EN.U4CSE21001, AM.SC.U3PHY22045
 */
export const ROLL_NUMBER_REGEX = /^AM\.[A-Za-z]{2}\.[A-Za-z0-9]{10}$/;

export interface RollNumberValidationResult {
  isValid: boolean;
  normalized: string;
  errorMessage?: string;
}

export function validateRollNumber(raw: string): RollNumberValidationResult {
  if (!raw || !raw.trim()) {
    return {
      isValid: false,
      normalized: '',
      errorMessage: 'Roll number is required for campus student verification.'
    };
  }

  // Auto-uppercase for consistency
  const clean = raw.trim().toUpperCase();

  if (!clean.startsWith('AM.')) {
    return {
      isValid: false,
      normalized: clean,
      errorMessage: 'Roll number must start with AM. (e.g. AM.EN.U4CSE21001)'
    };
  }

  const parts = clean.split('.');
  if (parts.length !== 3) {
    return {
      isValid: false,
      normalized: clean,
      errorMessage: 'Format must be AM.XX.XXXXXXXXXX with exactly two dots.'
    };
  }

  const [prefix, facultyCode, studentId] = parts;

  if (prefix !== 'AM') {
    return {
      isValid: false,
      normalized: clean,
      errorMessage: 'Prefix must be AM.'
    };
  }

  if (!/^[A-Z]{2}$/.test(facultyCode)) {
    return {
      isValid: false,
      normalized: clean,
      errorMessage: 'Campus/Faculty code must be 2 letters (e.g. EN, SC, BT, AR).'
    };
  }

  if (!/^[A-Z0-9]{10}$/.test(studentId)) {
    return {
      isValid: false,
      normalized: clean,
      errorMessage: `Student ID code must be 10 characters (currently ${studentId.length}/10).`
    };
  }

  return {
    isValid: true,
    normalized: clean
  };
}

/**
 * XSS prevention and sanitization: escapes dangerous HTML entities
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}
