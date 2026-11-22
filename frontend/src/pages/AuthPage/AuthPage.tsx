import { AuthForm } from "../../features/auth/components/AuthForm/AuthForm";
import { Container } from "../../shared/components/Container/Container";

export const AuthPage = () => {
  return (
    <section>
      <Container>
        <AuthForm />
      </Container>
    </section>
  );
};
