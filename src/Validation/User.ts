export const UserRegistrationValidationRules = {
  id: "required|string",
  name: "required|string|min:3|max:255",
  email: "required|email",
  password: "required|string|min:8"
};

export const UserLoginValidationRules = {
  email: "required|email",
  password: "required|string|min:8"
};