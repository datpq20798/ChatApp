import React, {useState} from 'react';
import { Collapse, Typography, Button } from 'antd';
import styled from 'styled-components';
import { CheckCircleTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const AdminItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
  font-weight: 500;
`;
const MngList = ({ setSelectedComponent }) => {
    const [isRoomSelected, setIsRoomSelected] = useState(false);
    const [isUserSelected, setIsUserSelected] = useState(false);
  
    const handleRoomClick = () => {
      setSelectedComponent('MngAdmin');
      setIsRoomSelected(true);
      setIsUserSelected(false);
    };
  
    const handleUserClick = () => {
      setSelectedComponent('MngUser');
      setIsRoomSelected(false);
      setIsUserSelected(true);
    };
  
    return (
      <>
        <Collapse ghost defaultActiveKey={['1']}>
          <PanelStyled header='Quản lý thông tin' key='1'>
            <AdminItemWrapper>
              <LinkStyled>
                <Button type='link' onClick={handleRoomClick}>
                {isRoomSelected && <CheckCircleTwoTone />} Danh sách phòng 
                </Button>
                <br></br>
                <Button type='link' onClick={handleUserClick}>
                {isUserSelected && <CheckCircleTwoTone />} Danh sách người dùng 
                </Button>
              </LinkStyled>
            </AdminItemWrapper>
          </PanelStyled>
        </Collapse>
      </>
    );
  };
  
  export default MngList;
  
