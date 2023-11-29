import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { Table, Spin, Modal, Button, message, Pagination } from 'antd';
import { db } from '../../firebase/config';
import 'moment/locale/vi';
import './MngRoom.css'
const MngRoom = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State cho modal xác nhận xóa
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả phòng',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createBy',
      key: 'createBy',
    },

    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <a onClick={() => handleDelete(record)}>Delete</a>,
    },
  ];

  const handleDelete = async (record) => {
    console.log('Deleting room:', record);
    try {
      const roomId = record.id; // Lấy ID của phòng từ record
      setDeleteModalVisible(true); // Hiển thị modal xác nhận xóa

      const confirmDelete = async () => {
        await db.collection('rooms').doc(roomId).delete(); // Xóa phòng từ Firestore theo ID
        console.log('Room deleted successfully:', roomId);

        // Cập nhật dataSource để cập nhật giao diện khi phòng đã bị xóa
        const updatedData = dataSource.filter(item => item.id !== roomId);
        setDataSource(updatedData);

        setDeleteModalVisible(false); // Ẩn modal xác nhận xóa
        message.success('Xóa tài phòng thành công.');
      };

      const cancelDelete = () => {
        setDeleteModalVisible(false); // Ẩn modal xác nhận xóa
      };

      Modal.confirm({
        title: 'Xác nhận xóa phòng',
        content: 'Bạn có chắc chắn muốn xóa phòng này?',
        onOk: confirmDelete,
        onCancel: cancelDelete,
      });
    } catch (error) {
      console.error('Error deleting room:', error);
    }

  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsCollection = db.collection('rooms');
        const roomsSnapshot = await roomsCollection.get();
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
          id: doc.id,
        }));

        setDataSource(roomsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (

    <div style={{ padding: '20px' }}>
      {loading && (
        <Spin
          tip="Loading..."
          size="large"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        />
      )}
      <h1 style={{ textAlign: 'center' }}>Danh Sách Phòng</h1>
      <Table columns={columns} dataSource={paginatedData} pagination={false} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          current={currentPage}
          onChange={onPageChange}
          total={dataSource.length}
          pageSize={pageSize}
        />
      </div>
    </div>



  )
}






export default MngRoom;