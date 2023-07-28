import { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { DefaultFooter } from '@ant-design/pro-components';
import { Auth0Provider } from '@auth0/auth0-react';
import { getAccessToken } from '@/utils/auth';
import RightContent from '@/layouts/RightContent';

// @umijs/plugin-request
export const request: RequestConfig = {
  baseURL: process.env.API_HOST,
  requestInterceptors: [
    (url, options) => {
      const token = getAccessToken();
      return {
        url,
        options: {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `${token}`,
          },
        },
      };
    },
  ],
};

export const layout: RunTimeLayoutConfig = () => {
  return {
    fixSiderbar: true,
    layout: 'top',
    navTheme: 'light',
    // fix umi-plugin-layout bug
    logo: undefined,
    title: false,
    rightContentRender: () => <RightContent />,
    footerRender: () => <DefaultFooter links={false} copyright="Scheduling" />,
  };
};

// @umijs/plugin-initial-state
export async function getInitialState() {
  return {
    isAuthenticated: false,
  };
}

export function rootContainer(container: any) {
  return (
    <Auth0Provider
      domain={process.env.AUTH_DOMAIN!}
      clientId={process.env.AUTH_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: process.env.AUTH_REDIRECT_URI!,
        audience: process.env.AUTH_AUDIENCE!,
      }}
    >
      {container}
    </Auth0Provider>
  );
}
