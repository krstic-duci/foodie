import { BrowserRouter } from "react-router-dom";

import Routes from "./router/Routes";

const App = () => {
  // TODO: implement auth jwt cookie check from backend
  return (
    <main>
      <BrowserRouter>
        <Routes isAuthenticated={Boolean(false)} />
      </BrowserRouter>
    </main>
  );
};

export default App;
