import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { TokenContextProvider } from "@features/TokenProvider";
import { PrivilegeContextData, PrivilegeContextProvider, PrivilegeData } from "@features/PrivilegeProvider";
import { PrivilegeNames } from "@shared/config/privileges";
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
