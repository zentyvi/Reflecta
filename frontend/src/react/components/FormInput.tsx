import type { FieldErrors } from "../../../../types/ErrorObjects.d.ts";

const styles = {} as CSSModuleClasses;

type BaseProps = {
  disabled?: boolean;
  required?: boolean;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  label: string | React.ReactNode;
  placeholder?: string;
  error?: string | FieldErrors | null;
  subTitle?: string;
};

type OtherInputs = BaseProps & {
  type?: "text" | "email" | "number" | "tel" | "url";
};

type TextareaProps = BaseProps & {
  type?: "textarea";
  cols?: number;
  rows?: number;
};

type PasswordProps = BaseProps & {
  type?: "password";
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onShowPassword?: () => void;
};

type FormInputProps = OtherInputs | TextareaProps | PasswordProps;

function FormInput(props: FormInputProps) {
  const {
    type,
    disabled,
    required,
    name,
    value,
    onChange,
    label,
    placeholder,
    error,
    subTitle,
  } = props;
  // Check if any error provided
  const errorMessage = error
    ? typeof error === "string"
      ? error
      : error.msg
    : null;

  const inputClassName = `${styles["input-field"]} ${
    errorMessage ? styles["input-field--error"] : ""
  }`;

  // Generating random id
  const id = crypto.randomUUID();

  let input;
  // Find what input to show
  if (type !== "password" && type !== "textarea") {
    input = (
      <input
        disabled={disabled}
        type={type}
        name={name || id}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={inputClassName}
      />
    );
  } else if (type === "textarea") {
    const { cols, rows } = props;
    input = (
      <textarea
        disabled={disabled}
        name={name || id}
        id={id}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        cols={cols}
        rows={rows}
        value={value}
        className={`${inputClassName} ${styles["input-field--textarea"]}`}
      />
    );
  } else if (type === "password") {
    const { showPasswordToggle, showPassword, onShowPassword } = props;
    input = (
      <>
        <input
          disabled={disabled}
          type={showPassword ? "text" : "password"}
          name={name || id}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClassName}
          data-testid="password-input"
        />
        {/* Show a button to toggle password's visibility */}
        {showPasswordToggle && (
          <button
            type="button"
            aria-label="Show password"
            aria-pressed={showPassword}
            className={styles["input-toggle-password-btn"]}
            onClick={() => onShowPassword && onShowPassword()}
          >
            {showPassword ? (
              <i className="bi bi-eye-slash-fill" aria-hidden="true" />
            ) : (
              <i className="bi bi-eye-fill" aria-hidden="true" />
            )}
          </button>
        )}
      </>
    );
  }

  return (
    <div className={styles["input-wrapper"]}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={styles["input-label"]}
          data-testid="input-label"
        >
          {label}
          {required && <span className={styles["input-required"]}>*</span>}
        </label>
      )}

      {/* Show subtitle if provided */}
      {subTitle && <span className={styles["input-subtitle"]}>{subTitle}</span>}

      {/* Input */}
      {type !== "textarea" ? (
        <div className={styles["input-container"]}>{input}</div>
      ) : (
        input
      )}

      {/* Show error if provided */}
      {errorMessage && (
        <span className={styles["input-error-msg"]}>{errorMessage}</span>
      )}
    </div>
  );
}

export default FormInput;
