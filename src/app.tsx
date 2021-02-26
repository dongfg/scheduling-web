import { BasicLayoutProps } from '@ant-design/pro-layout';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Auth0Provider } from '@auth0/auth0-react';
import Auth0Wrapper from '@/layouts/Auth0Wrapper';
import RightContent from '@/layouts/RightContent';

export const layout: BasicLayoutProps = {
  fixSiderbar: true,
  layout: 'top',
  navTheme: 'light',
  // fix umi-plugin-layout bug
  logo: undefined,
  rightContentRender: () => <RightContent />,
  footerRender: () => <DefaultFooter links={false} copyright="Scheduling" />,
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
      redirectUri={process.env.AUTH_REDIRECT_URI!}
      audience={process.env.AUTH_AUDIENCE!}
    >
      <Auth0Wrapper>{container}</Auth0Wrapper>
    </Auth0Provider>
  );
}
