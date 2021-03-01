import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { useAuth0 } from '@auth0/auth0-react';
import { Spin } from 'antd';
import { setAccessToken } from '@/utils/auth';

const Auth0Wrapper: React.FC<any> = ({ children }) => {
  const { initialState, loading, setInitialState } = useModel('@@initialState');
  const {
    isAuthenticated: isAuth0Authenticated,
    isLoading: isAuth0Loading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { isAuthenticated } = initialState!;

  useEffect(() => {
    if (loading || isAuth0Loading || isAuthenticated) {
      return;
    }

    !isAuth0Authenticated &&
      (async (): Promise<void> => {
        await loginWithRedirect({
          appState: {
            returnTo: `${window.location.pathname}${window.location.search}`,
          },
        });
      })();

    isAuth0Authenticated &&
      (async () => {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
        setInitialState({
          ...initialState,
          isAuthenticated: true,
        });
      })();
  }, [
    loading,
    isAuth0Loading,
    isAuth0Authenticated,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    setInitialState,
  ]);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Spin
      style={{
        textAlign: 'center',
        paddingTop: '48vh',
        height: '100vh',
        width: '100vw',
      }}
      size="large"
      tip="Checking your login state and permission ..."
    ></Spin>
  );
};

export default Auth0Wrapper;
