import { BrowserRouter } from 'react-router-dom';

import AppRouter from './AppRouter';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivilegeContextProvider from '@widgets/PrivilegeProvider';
import ApiContextProvider from '@widgets/ApiProvider';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <ApiContextProvider>
        <QueryClientProvider client={queryClient}>
          <PrivilegeContextProvider>
            <AppRouter />
          </PrivilegeContextProvider>
        </QueryClientProvider>
      </ApiContextProvider>
    </BrowserRouter>
  );
};

export default App;
