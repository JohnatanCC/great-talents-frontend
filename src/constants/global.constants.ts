export const defaultOptionSelect = {
  value: "",
  label: "",
};

export const methodToValidateSelectEmpty = (value: any) => {
  return value?.value !== "";
};

export const tokenKeyLocalStorage = "@jwt_token";
export const profileKeyLocalStorage = "@profile";
export const nameKeyLocalStorage = "@name";