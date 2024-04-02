import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { TokenContextProvider } from "@features/TokenProvider";
import { PrivilegeContextProvider } from "@features/PrivilegeProvider";

const App = () => {
  return (
    <BrowserRouter>
      <TokenContextProvider>
        <PrivilegeContextProvider>
          <AppRouter />
        </PrivilegeContextProvider>
      </TokenContextProvider>
    </BrowserRouter>
  );
};

export default App;
