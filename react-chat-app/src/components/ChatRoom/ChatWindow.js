import { UserAddOutlined, LinkOutlined  } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert } from 'antd';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';
import { storage } from '../../firebase/config';

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  
  const [image, setImage] = useState(null); // Thêm state để lưu trữ ảnh gửi đi
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setImage(file);
  // };
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${file.name}`);
        imageRef.put(file).then(() => {
          imageRef.getDownloadURL().then((imageUrl) => {
            addDocument('messages', {
              imageUrl,
              uid,
              photoURL,
              roomId: selectedRoom.id,
              displayName,
            });
          });
        });
      }
    };
    input.click();
  };


  const handleOnSubmit = async () => {
    if (image) {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(`images/${image.name}`);
      await imageRef.put(image);

      const imageUrl = await imageRef.getDownloadURL();

      addDocument('messages', {
        imageUrl,
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
      });

      // Reset state
      setImage(null);
    } else {
      addDocument('messages', {
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
      });
    }
    // Lấy URL của ảnh


    form.resetFields(['message']);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore('messages', condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className='header__info'>
              <p className='header__title'>{selectedRoom.name}</p>
              <span className='header__description'>
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type='text'
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size='small' maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ''
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                  imageUrl={mes.imageUrl}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Nhập tin nhắn...'
                  bordered={false}
                  autoComplete='off'
                />
              </Form.Item>
              <LinkOutlined onClick={handleImageUpload} style={{ fontSize: '18px', cursor: 'pointer', margin: '0 8px' }} />
              <Button type='primary' onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}