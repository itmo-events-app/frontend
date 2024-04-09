import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { PrivilegeContextProvider } from "@features/PrivilegeProvider";
import { userAdministrator, userHelper, userOrganizer, userReader } from "./privileges";

const App = () => {
  const privilegeContext = userAdministrator;

  return (
    <BrowserRouter>
      <PrivilegeContextProvider context={privilegeContext}>
        <AppRouter />
      </PrivilegeContextProvider>
    </BrowserRouter>
  );
};

export default App;
