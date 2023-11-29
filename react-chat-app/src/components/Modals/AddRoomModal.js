import React, { useContext } from 'react';
import { Form, Modal, Input, message } from 'antd';
import { AppContext  } from '../../Context/AppProvider';
import { addDocument, getNextRoomKey   } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

export default function AddRoomModal() {
 
  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const {
    user: { uid, email},
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleOk = async () => {

    // add room mới vào firestore
    const roomName = form.getFieldValue('name');
    
    const nextRoomKey = await getNextRoomKey();
    
    try {
      addDocument('rooms', { ...form.getFieldsValue(), members: [uid], createBy: email, key: nextRoomKey});
      message.success(`Tạo phòng ${roomName} thành công.`);
    } catch (error) {
      message.error('Tạo phòng thất bại');
    }

    // Reset giá trị của form
    form.resetFields();

    //ẩn model thêm phòng
    setIsAddRoomVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title='Tạo phòng'
        visible={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout='vertical'>
          <Form.Item label='Tên phòng' name='name'>
            <Input placeholder='Nhập tên phòng' />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea placeholder='Nhập mô tả' />
          </Form.Item>
          {/* <Form.Item label='Key' name='key'>
            <Input disabled value={key} />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
}
