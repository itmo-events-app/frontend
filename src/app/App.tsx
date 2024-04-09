import { BrowserRouter } from "react-router-dom";

import AppRouter from "./AppRouter";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivilegeContextProvider from "@widgets/PrivilegeProvider";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PrivilegeContextProvider>
          <AppRouter />
        </PrivilegeContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
