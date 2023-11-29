
import React from 'react';
import { Avatar, Typography, Dropdown, Menu, Modal, Image, Form, Input } from 'antd';
import styled from 'styled-components';

import { auth } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);
  background-color: #3366FF;

  .username {
    color: white;
    margin-left: 15px;
    
  }
`;

const menuItems = [
  {
    key: 'userInfo',
    label: 'Thông tin cá nhân',
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
  },
];

export default function UserInfo() {
  const [userInfoModalVisible, setUserInfoModalVisible] = React.useState(false);
  const showUserInfoModal = () => {
    setUserInfoModalVisible(true);
  };

  const {
    user: { displayName, photoURL, email},
  } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleLogout = () => {
    clearState();
    auth.signOut();
    setLogoutModalVisible(false);
  };

  const handleCancel = () => {
    setLogoutModalVisible(false);
  };

  const menu = (
    <Menu onClick={({ key }) => {
      if (key === 'userInfo') {
        showUserInfoModal();
      } else if (key === 'logout') {
        showLogoutModal();
      }
    }}>
      {menuItems.map(item => (
        <Menu.Item key={item.key}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <WrapperStyled>
      <div>
        <Dropdown overlay={menu} placement="bottomLeft" arrow>
          <a onClick={e => e.preventDefault()}>
            <Avatar src={photoURL}>
              {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography.Text className='username'>{displayName}</Typography.Text>

          </a>
        </Dropdown>
      </div>
      <Modal
        title="Thông báo !!"
        visible={logoutModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
      </Modal>
      <Modal
        title="Thông tin cá nhân"
        visible={userInfoModalVisible}
        onCancel={() => setUserInfoModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <Image
              width={100}
              src={photoURL}
            ></Image>
          </div>
          <div>
            <Form
            
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                
                width: 300
              }}
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item
                label="Tên"
              >
                <Input style={{ borderRadius: 10, color: 'black' }} value={displayName} disabled />
              </Form.Item>
              <Form.Item
                label="Email"
              >
                <Input style={{ borderRadius: 10, color: 'black' }} value={email} disabled />
              </Form.Item>

            </Form>
          </div>


        </div>
      </Modal>
    </WrapperStyled>
  );
}
