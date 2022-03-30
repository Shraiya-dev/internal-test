export const checkKeys = (arr, key) => {
  const check = arr.includes(key);
  return check;
};

export const prepareJobTypesData = (data) => {
  const res = [];
  data.forEach((item) => {
    res.push({
      value: item.jtKey,
      label: item.jtValue,
    });
  });
  return res;
};

export const modifyOptions = (data, name, setState, originalData) => {
  data = data.map((item) => {
    return {
      value: item.name,
      label: item.name,
      ...item,
    };
  });
  setState({ ...originalData, [name]: data });
};

export const findIso = (data, value) => {
  const res = data.find((item) => item.value === value);
  return res.iso2;
};
