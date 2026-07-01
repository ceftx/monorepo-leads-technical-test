import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';

// auth provider
import { AuthProvider } from 'contexts/AuthContext';
import { SnackbarProvider } from 'contexts/SnackbarContext';

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <SnackbarProvider>
        <AuthProvider>
          <NavigationScroll>
            <RouterProvider router={router} />
          </NavigationScroll>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeCustomization>
  );
}
