import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { loginWithEmail, registerWithEmail } from "../../../../firebase/auth";
import { authSchema, type AuthFormValues } from "../../schemas/authSchema";

const getFirebaseErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return "Не вдалося виконати дію. Спробуйте ще раз.";
  }

  const messages: Record<string, string> = {
    "auth/email-already-in-use":
      "Ця адреса вже зареєстрована. Спробуйте увійти.",
    "auth/invalid-email": "Перевірте правильність електронної адреси.",
    "auth/weak-password": "Пароль надто простий.",
    "auth/invalid-credential": "Неправильна електронна адреса або пароль.",
    "auth/too-many-requests": "Забагато спроб. Зачекайте та спробуйте ще раз.",
  };

  return messages[error.code] ?? "Не вдалося виконати дію. Спробуйте ще раз.";
};

export const AuthForm = () => {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      mode: "register",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const mode = watch("mode");

  const onSubmit = handleSubmit(async values => {
    setServerError("");

    try {
      if (values.mode === "register") {
        await registerWithEmail(
          values.email.trim(),
          values.password,
          values.firstName ?? "",
          values.lastName ?? "",
        );
      } else {
        await loginWithEmail(values.email.trim(), values.password);
      }
    } catch (error) {
      setServerError(getFirebaseErrorMessage(error));
    }
  });

  const changeMode = () => {
    setValue("mode", mode === "login" ? "register" : "login");
    clearErrors();
    setServerError("");
  };

  return (
    <>
      <h1>{mode === "login" ? "З поверненням!" : "Створіть акаунт"}</h1>

      <form onSubmit={onSubmit}>
        <input
          type="hidden"
          {...register("mode")}
        />

        {mode === "register" && (
          <>
            <label>
              Ім&apos;я
              <input
                autoComplete="given-name"
                {...register("firstName")}
              />
            </label>
            {errors.firstName?.message && <p>{errors.firstName.message}</p>}

            <label>
              Прізвище
              <input
                autoComplete="family-name"
                {...register("lastName")}
              />
            </label>
            {errors.lastName?.message && <p>{errors.lastName.message}</p>}
          </>
        )}

        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </label>
        {errors.email?.message && <p>{errors.email.message}</p>}

        <label>
          Password
          <input
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            {...register("password")}
          />
        </label>
        {errors.password?.message && <p>{errors.password.message}</p>}

        {serverError && <p role="alert">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Зачекайте..."
            : mode === "login"
              ? "Увійти"
              : "Створити акаунт"}
        </button>
      </form>

      <p>
        {mode === "login" ? "Не маєте акаунта?" : "Вже маєте акаунт?"}{" "}
        <button
          type="button"
          onClick={changeMode}
        >
          {mode === "login" ? "Зареєструватися" : "Увійти"}
        </button>
      </p>
    </>
  );
};
