import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';

const RightContent: React.FC<any> = () => {
  const { user, logout } = useAuth0();

  const menu = (
    <Menu className="umi-plugin-layout-menu">
      <Menu.Item
        key="logout"
        onClick={() => {
          logout({ returnTo: window.location.origin });
        }}
      >
        <LogoutOutlined />
        退出登陆
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
