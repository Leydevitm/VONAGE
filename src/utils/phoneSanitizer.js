
const sanitizePhone = (phoneNumber) => {

    console.log('[Utils] sanitizePhone:', phoneNumber);

  if (!phoneNumber) return null;
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.startsWith('52') && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 10) {
    return `+52${digitsOnly}`;
  }
  return null;
}

module.exports = sanitizePhone;
