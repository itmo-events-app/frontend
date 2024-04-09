import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { PrivilegeContextProvider } from "@features/PrivilegeProvider";
import { userAdministrator } from "./privileges";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const privilegeContext = userAdministrator;
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PrivilegeContextProvider context={privilegeContext}>
          <AppRouter />
        </PrivilegeContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
