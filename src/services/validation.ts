/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { toast } from 'react-toastify';

/**
 * Check if date is valid.
 * @param date date in format DD/MM/YYYY.
 * @param type type max or min.
 * @return boolean
 */
export const validateDate = (
  date: string | undefined,
  type: 'min' | 'max',
): boolean => {
  if (!date) return false;

  const splitDate = date.split('/') || [];

  if (!splitDate.length) return false;

  const [year, month, day] = [
    Number(splitDate[2]),
    Number(splitDate[1]),
    Number(splitDate[0]),
  ];

  const formattedDate = new Date(`${year}/${month}/${day}`);
  const now = new Date();

  return formattedDate.getFullYear() === year &&
    formattedDate.getMonth() + 1 === month &&
    formattedDate.getDate() === day &&
    type === 'min'
    ? now.getTime() >= formattedDate.getTime()
    : now.getTime() <= formattedDate.getTime() ||
        (now.getDate() <= formattedDate.getDate() &&
          now.getMonth() <= formattedDate.getMonth() &&
          now.getFullYear() <= formattedDate.getFullYear());
};

/**
 * Check if date is valid.
 * @param date date in format DD/MM/YYYY.
 * @return boolean
 */
export const validateDateUS = (date: string | undefined): boolean => {
  if (!date) return false;

  const splitDate = date.split('/') || [];

  if (!splitDate.length) return false;

  const [year, month, day] = [
    Number(splitDate[2]),
    Number(splitDate[1]),
    Number(splitDate[0]),
  ];

  const formattedDate = new Date(`${year}/${month}/${day}`);

  return (
    formattedDate.getFullYear() === year &&
    formattedDate.getMonth() + 1 === month &&
    formattedDate.getDate() === day
  );
};

/**
 * Check if CPF is valid.
 * @param cpf cpf.
 * @return boolean
 */
export const validateCpf = (cpf: string): boolean => {
  let sum = 0;
  let rest;

  const formattedCpf = cpf.replace(/[\s.-]*/gim, '');
  if (
    !formattedCpf ||
    formattedCpf.length !== 11 ||
    formattedCpf === '00000000000' ||
    formattedCpf === '11111111111' ||
    formattedCpf === '22222222222' ||
    formattedCpf === '33333333333' ||
    formattedCpf === '44444444444' ||
    formattedCpf === '55555555555' ||
    formattedCpf === '66666666666' ||
    formattedCpf === '77777777777' ||
    formattedCpf === '88888888888' ||
    formattedCpf === '99999999999'
  ) {
    return false;
  }

  for (let i = 1; i <= 9; i += 1)
    sum += parseInt(formattedCpf.substring(i - 1, i), 10) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(formattedCpf.substring(9, 10), 10)) return false;

  sum = 0;
  for (let i = 1; i <= 10; i += 1)
    sum += parseInt(formattedCpf.substring(i - 1, i), 10) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(formattedCpf.substring(10, 11), 10)) return false;

  return true;
};

/**
 * Checking if passwords match.
 * @param password password.
 * @param confirmPassword confirmPassword.
 * @return boolean
 */
export const checkPassword = (
  password: string,
  confirmPassword: string,
): boolean => {
  const validate = password === confirmPassword;
  if (validate) {
    return true;
  }
  toast.error('Senhas não coincidem');
  return false;
};

/**
 * Checking name.
 * @param name name.
 * @return boolean
 */
export const checkName = (name: string): boolean => {
  const splitName = name.split(' ') || [];

  if (splitName.length > 2) {
    return true;
  }
  return false;
};
