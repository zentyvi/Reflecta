import type { ErrorsObject } from "../../@types/ErrorObjects";

type Validator = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setErrors: React.Dispatch<React.SetStateAction<ErrorsObject>>,
  field?: string,
) => void;

export const validateUsername: Validator = (
  e,
  setErrors,
  field = "username",
) => {
  const { value } = e.target;

  if (value.length > 0) {
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_|-]*[a-zA-Z0-9]$/;
    // Check the length first
    if (value.length > 30 || value.length < 3) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Username must be between 3 and 30 characters",
        },
      }));
      return;
    }
    if (!usernameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Username can only contain letters, numbers, underscores and hyphens",
        },
      }));
      return;
    }
  }
  setErrors((prev) => ({ ...prev, [field]: null }));
};

export const validatePassword: Validator = (
  e,
  setErrors,
  field = "password",
) => {
  const { value } = e.target;

  if (value.length > 0) {
    const passwordRegex = /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
    if (!passwordRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Password can contain only letters, numbers and symbols without spaces",
        },
      }));
      return;
    }
    if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        [field]: { msg: "Password must contain at least 6 characters" },
      }));
      return;
    }
  }
  setErrors((prev) => ({ ...prev, [field]: null }));
};
