import z from "zod";

export const authSchema = z
  .object({
    mode: z.enum(["login", "register"]),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Вкажіть коректний email"),
    password: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
    confirmPassword: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.mode !== "register") return;

    if (!values.firstName?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["firstName"],
        message: "Вкажіть ім'я",
      });
    }

    if (!values.lastName?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["lastName"],
        message: "Вкажіть прізвище",
      });
    }

    if (!values.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Повторіть пароль",
      });
    } else if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Паролі не співпадають",
      });
    }
  });

export type AuthFormValues = z.infer<typeof authSchema>;
