import React, { useState } from 'react';
import { Collapse, Typography, Button, message, Modal } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined, DeleteOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';
import firebase from 'firebase/app';
import 'firebase/firestore';

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

const RoomItemWrapper = styled.div`
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


export default function RoomList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomIdToDelete, setSelectedRoomIdToDelete] = useState(null);
  

  const showModal = (roomId) => {
    setSelectedRoomIdToDelete(roomId)
    console.log(roomId)
    setIsModalOpen(true);
  };

  const firestore = firebase.firestore();
  const handleOk = async () => {
    const roomId = selectedRoomIdToDelete;
    console.log(roomId)
    await firestore.collection('rooms').doc(roomId).delete();
    setIsModalOpen(false);
    message.success(`Xóa phòng thành công`);
  };
  const handleCancel = () => {
    console.log(rooms)
    setIsModalOpen(false);
  };
  const { rooms, setIsAddRoomVisible, setSelectedRoomId } = React.useContext(AppContext);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const handleAddRoom = async () => {
    setIsAddRoomVisible(true);
  };
  const handleRoomClick = (roomId) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
    setSelectedRoomId(roomId);
  }

  return (
    <>
      <Collapse ghost defaultActiveKey={['1']}>
        <PanelStyled header='Danh sách các phòng' key='1'>
          {rooms.map((room) => (
            <RoomItemWrapper key={room.id}>

              <LinkStyled onClick={() => handleRoomClick(room.id)}>
                {selectedRoom === room.id && <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: '5px' }} />}

                {room.name}

              </LinkStyled>
              {/* onClick={() => handleOkDelete(room.id)} */}
              
              <Button type='text' icon={<DeleteOutlined />} danger onClick={() => showModal(room.id)}>
                Xoá
              </Button>
              <Modal title="Cảnh báo!!" onOk={handleOk} onCancel={handleCancel} visible={isModalOpen}>
                <p>Bạn có chắc chắn muốn xóa Room không?</p>
              </Modal>
            </RoomItemWrapper>
          ))}
          <Button type='text' icon={<PlusSquareOutlined />} className='add-room' onClick={handleAddRoom}>
            Thêm phòng
          </Button>
        </PanelStyled>
      </Collapse>



    </>


  );
}
