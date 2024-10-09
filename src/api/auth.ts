import { auth, db } from '@/firebase';
import { IUser } from '@/types/authType';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { RegisterUserReqDTO } from './dtos/authDTO';

export const registerUserAPI = async ({
  email,
  password,
  name,
}: RegisterUserReqDTO): Promise<IUser> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    name,
    email,
  });

  return {
    uid: user.uid,
    email: user.email!,
    displayName: name,
  };
};
