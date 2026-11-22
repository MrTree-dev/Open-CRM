import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
} from "../../../../firebase/auth";
import { authSchema, type AuthFormValues } from "../../schemas/authSchema";

import css from "./AuthForm.module.css";
import { FaEye, FaGoogle, FaUserPlus } from "react-icons/fa";
import { FaEyeLowVision, FaRightToBracket } from "react-icons/fa6";
import { Button } from "../../../../shared/components/Button/Button";

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
  const [isPasswordHidden, setIsPasswordHidden] = useState(false);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(false);

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

  const handleIsPasswordHidden = () => {
    setIsPasswordHidden(prev => !prev);
  };

  const handleIsConfirmPasswordHidden = () => {
    setIsConfirmPasswordHidden(prev => !prev);
  };

  const handleGoogleButton = async () => {
    await loginWithGoogle();
  };

  return (
    <div className={css.auth}>
      <div className={css.heading}>
        {mode === "login" ? (
          <FaRightToBracket size={50} />
        ) : (
          <FaUserPlus size={50} />
        )}
        <h1>{mode === "login" ? "З поверненням!" : "Створіть акаунт"}</h1>
        <p>
          {mode === "login"
            ? "Увійдіть в свій акаунт, щоб продовжити роботу."
            : "Почніть керувати власним бізнесом зручніше."}
        </p>
      </div>

      <Button
        onClick={handleGoogleButton}
        view="secondary"
      >
        <FaGoogle />
        Продовжити з Google
      </Button>

      <div className={css.divider}>АБО</div>

      <form
        onSubmit={onSubmit}
        className={css.form}
      >
        <input
          type="hidden"
          {...register("mode")}
        />

        {mode === "register" && (
          <div className={css.input_name}>
            <div>
              <label>
                <span>Ім&apos;я</span>
                <input
                  autoComplete="given-name"
                  placeholder="Джон"
                  {...register("firstName")}
                />
              </label>
              {errors.firstName?.message && <p>{errors.firstName.message}</p>}
            </div>

            <div>
              <label>
                <span>Прізвище</span>
                <input
                  autoComplete="family-name"
                  placeholder="Доу"
                  {...register("lastName")}
                />
              </label>
              {errors.lastName?.message && <p>{errors.lastName.message}</p>}
            </div>
          </div>
        )}

        <div>
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              {...register("email")}
            />
          </label>
          {errors.email?.message && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label className={css.password}>
            <span>Пароль</span>
            <input
              type={!isPasswordHidden ? "password" : "text"}
              placeholder="********"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              {...register("password")}
            />
            {isPasswordHidden ? (
              <FaEye
                size={20}
                className={css.secret}
                onClick={handleIsPasswordHidden}
              />
            ) : (
              <FaEyeLowVision
                size={20}
                className={css.secret}
                onClick={handleIsPasswordHidden}
              />
            )}
          </label>
          {errors.password?.message && <p>{errors.password.message}</p>}
        </div>

        <div>
          {mode === "register" && (
            <label className={css.password}>
              <span>Повторіть пароль</span>
              <input
                type={!isConfirmPasswordHidden ? "password" : "text"}
                placeholder="********"
                {...register("confirmPassword")}
              />
              {isConfirmPasswordHidden ? (
                <FaEye
                  size={20}
                  className={css.secret}
                  onClick={handleIsConfirmPasswordHidden}
                />
              ) : (
                <FaEyeLowVision
                  size={20}
                  className={css.secret}
                  onClick={handleIsConfirmPasswordHidden}
                />
              )}
            </label>
          )}
          {errors.confirmPassword?.message && (
            <p>{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p role="alert">{serverError}</p>}

        <Button disabled={isSubmitting}>
          {mode === "login" ? "Увійти" : "Створити акаунт"}
        </Button>
      </form>

      <div className={css.switch}>
        {mode === "login" ? "Не маєте акаунта?" : "Вже маєте акаунт?"}{" "}
        <button
          type="button"
          onClick={changeMode}
        >
          {mode === "login" ? "Зареєструватися" : "Увійти"}
        </button>
      </div>
    </div>
  );
};
