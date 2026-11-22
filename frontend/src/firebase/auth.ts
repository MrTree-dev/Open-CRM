import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const registerWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(credential.user, {
    displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
  });

  return credential.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
};

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider);

  const user = credential.user;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    isNewUser: getAdditionalUserInfo(credential)?.isNewUser ?? false,
  };
};

export const logout = async () => {
  await signOut(auth);
};
