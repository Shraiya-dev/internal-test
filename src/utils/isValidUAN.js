export const isValidUAN = (uanNumber) => {
  const pattern = /^\d{12}$/gm;
  return pattern.test(uanNumber);
};
