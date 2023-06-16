import { createContext } from "react";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}
// TODO: better types
interface AppAuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AppAuthContext>({
  user: null,
  setUser: () => {}
});
