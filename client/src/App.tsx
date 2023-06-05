import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./router/Routes";

const App = () => {
  // TODO: implement auth jwt cookie check from backend
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <main>
      <BrowserRouter>
        <Routes isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </main>
  );
};

export default App;
