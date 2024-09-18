import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator, useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo } from 'react';
import {
  Navigate,
  Route,
  Router,
  Routes,
} from 'react-router-dom';
import axios from 'axios';

import { routes } from '@/navigation/routes.tsx';
import { API_BASE_URL } from '../config';

export const App: FC = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

   useEffect(() => {
    const saveUser = async () => {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        try {
          const response = await axios.post(`${API_BASE_URL}/users`, {
            telegramId: user.id.toString(),
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            languageCode: user.language_code,
            isPremium: user.is_premium,
          });
          console.log('User saved:', response.data);
        } catch (error) {
          console.error('Error saving user:', error);
        }
      }
    };

    saveUser();
  }, []);

  const renderRoutes = () => {
    try {
      if (!Array.isArray(routes)) {
        console.error('Routes is not an array:', routes);
        return null;
      }
      return (
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      );
    } catch (error) {
      console.error('Error rendering routes:', error);
      return <div>An error occurred while loading the app. Please try again later.</div>;
    }
  };

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Router location={location} navigator={reactNavigator}>
        
          {routes.map((route) => <Route key={route.path} {...route} />)}
          {renderRoutes()}
        
      </Router>
    </AppRoot>
  );
};