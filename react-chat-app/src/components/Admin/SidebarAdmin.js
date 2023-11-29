import React from 'react';
import UserInfo from '../ChatRoom/UserInfo';
import MngList from './MngList';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const SidebarStyled = styled.div`
  background: #3f0e40;
  color: white;
  height: 100vh;
`;

const SidebarAdmin = ({ setSelectedComponent }) => { // Pass setSelectedComponent as a prop
  return (
    <>
      <SidebarStyled>
        <Row>
          <Col span={24}>
            <UserInfo />
          </Col>
          <Col span={24}>
            <MngList setSelectedComponent={setSelectedComponent} />
          </Col>
        </Row>
      </SidebarStyled>
    </>
  );
};

export default SidebarAdmin;
