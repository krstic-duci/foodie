import { BrowserRouter } from "react-router-dom";

import { AuthContext } from "./context/auth";
import Routes from "./router/Routes";

const App = () => {
  // TODO: implement auth jwt cookie check from backend
  return (
    <main>
      <AuthContext.Provider value={{ user: null, setUser: () => {} }}>
        <BrowserRouter>
          <Routes isAuthenticated={Boolean(false)} />
        </BrowserRouter>
      </AuthContext.Provider>
    </main>
  );
};

export default App;
