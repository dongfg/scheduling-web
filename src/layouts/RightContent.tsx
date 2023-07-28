import React, { useEffect } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { setAccessToken } from '@/utils/auth';

const RightContent: React.FC<any> = () => {
  const {
    user,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setAccessToken(accessToken);
      } catch (e) {
        loginWithRedirect();
      }
    };
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
      return;
    }
    if (isAuthenticated) {
      getAccessToken();
    }
  }, [isLoading, isAuthenticated, user?.sub]);

  const menu = (
    <Menu className="umi-plugin-layout-menu">
      <Menu.Item
        key="logout"
        onClick={() => {
          setAccessToken('');
          logout({ logoutParams: { returnTo: window.location.origin } });
        }}
      >
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const avatar = (
    <span className="umi-plugin-layout-action umi-plugin-layout-account">
      <Avatar
        size="small"
        className="umi-plugin-layout-avatar"
        src={user?.picture}
        alt="avatar"
      />
      <span className="umi-plugin-layout-name">{user?.name}</span>
    </span>
  );

  return (
    <div className="umi-plugin-layout-right">
      <Dropdown overlay={menu} overlayClassName="umi-plugin-layout-container">
        {avatar}
      </Dropdown>
    </div>
  );
};

export default RightContent;
