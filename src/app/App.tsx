import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { PrivilegeContextProvider } from "@features/PrivilegeProvider";

const App = () => {
  return (
    <BrowserRouter>
      <PrivilegeContextProvider>
        <AppRouter />
      </PrivilegeContextProvider>
    </BrowserRouter>
  );
};

export default App;
