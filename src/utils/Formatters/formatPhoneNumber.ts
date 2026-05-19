// Helper function to format phone number
export const formatPhoneNumber = (phone: string) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Format as 1-XXX-XXX-XXXX
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
  }

  return phone; // Return original if doesn't match pattern
};
