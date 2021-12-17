export const isANumber = (value) => {
  const re = /^[0-9\b]+$/;
  if (value === "" || re.test(value)) {
    return true;
  }
  return false;
};
