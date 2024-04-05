import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { TokenContextProvider } from "@features/TokenProvider";
import {PrivilegeContextProvider } from "@features/PrivilegeProvider";
import { userAdministrator, userHelper, userOrganizer, userReader } from "./privileges";

const App = () => {
  const privilegeContext = userAdministrator;

  return (
    <BrowserRouter>
      <TokenContextProvider>
        <PrivilegeContextProvider context={privilegeContext}>
          <AppRouter />
        </PrivilegeContextProvider>
      </TokenContextProvider>
    </BrowserRouter>
  );
};

export default App;
