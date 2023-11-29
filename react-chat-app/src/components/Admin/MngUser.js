import { MenuOutlined, DeleteOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState, useEffect } from 'react';
import { Table, Avatar, Spin, Pagination, Modal, Button, message } from 'antd';
import { db } from '../../firebase/config';
import googleImg from '../../images/icons8-google-48.png'
import mailImg from '../../images/email.svg'
import firebase from 'firebase/app';
import 'firebase/firestore';

// import admin from 'firebase-admin';
const pageSize = 4




const Row = ({ children, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            },
        ),
        transition,
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                if (child.key === 'sort') {
                    return React.cloneElement(child, {
                        children: (
                            <MenuOutlined
                                ref={setActivatorNodeRef}
                                style={{
                                    touchAction: 'none',
                                    cursor: 'move',
                                }}
                                {...listeners}
                            />
                        ),
                    });
                }

                return child;
            })}
        </tr>
    );
};
const MngUser = () => {
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [current, setCurrent] = useState(1);
    const [deletingUserId, setDeletingUserId] = useState(null);
    


    const columns = [
        {
            key: 'sort',
        },
        {
            title: 'Ảnh',
            width: 80,
            dataIndex: 'photoURL',
            render: (img, record) => (
                <Avatar size={40} src={record.photoURL} alt={record.displayName} />
            )
        },
        {
            title: 'Tên',
            dataIndex: 'displayName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phương thức',
            dataIndex: 'providerId',
            render: (providerId) => {
                let icon;
                let text;

                if (providerId === 'email.com') {
                    icon = <img src={mailImg} alt="Email Icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />;
                    text = 'Email';
                } else if (providerId === 'google.com') {
                    icon = <img src={googleImg} alt="Google Icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />;
                    text = 'Google';
                } else {
                    icon = null;
                    text = providerId;
                }

                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {icon}
                        {text}
                    </div>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, id) => (
                <Button
                    onClick={() => {
                        setDeletingUserId(id.id)
                        console.log(id.id)
                        setDeleteModalVisible(true);
                    }}
                    style={{ color: 'red', cursor: 'pointer' }}
                >
                    <DeleteOutlined />
                </Button>
            ),
        },
    ];


    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const firestore = firebase.firestore();

    const handleDelete = async (userId) => {
        try {
            // Xoá dữ liệu khỏi Firebase
   
            console.log(userId)
            // await auth.deleteUser(key);
            await firestore.collection('users').doc(userId).delete();
            // Cập nhật lại dataSource sau khi xoá thành công
            setDataSource((prevData) => prevData.filter(item => item.id !== userId));
            
            message.success('Xóa tài khoản thành công.');

        } catch (error) {
            console.error('Error deleting user: ', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersCollection = db.collection('users');
                const usersSnapshot = await usersCollection.get();
                const usersData = [];
                usersSnapshot.docs.forEach((doc) => {
                    const userData = { key: doc.id, ...doc.data(), id: doc.id };
                    usersData.push(userData);
                });
                console.log(usersData)

                setDataSource(usersData);
                setLoading(false); // Ẩn loading khi dữ liệu đã được tải
            } catch (error) {
                console.error('Error fetching users: ', error);
                setLoading(false); // Ẩn loading nếu có lỗi khi tải dữ liệu
            }
        };

        fetchData();
    }, []);

    const onPageChange = (page) => {
        setCurrent(page);
    };

    const paginatedData = dataSource.slice((current - 1) * pageSize, current * pageSize);
    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setDataSource((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            {loading && (
                <Spin tip="Loading..." size="large" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }} />
            )}
            {!loading && (
                <>
                    <h1 style={{ textAlign: 'center' }}>Danh Sách Người Dùng</h1>
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext items={paginatedData.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                            <Table
                                components={{
                                    body: {
                                        row: Row,
                                    },
                                }}
                                rowKey="key"
                                columns={columns}
                                dataSource={paginatedData}
                                pagination={false} // Tắt phân trang nếu muốn hiển thị tất cả dữ liệu một lúc
                                style={{ marginTop: '20px' }} // Điều chỉnh khoảng cách giữa tiêu đề và table
                            />
                        </SortableContext>
                    </DndContext>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Pagination
                            current={current}
                            onChange={onPageChange}
                            total={dataSource.length} // Số lượng dữ liệu
                            pageSize={pageSize} // Số lượng dữ liệu trên mỗi trang
                        />
                    </div>
                    <Modal
                        title="Xác nhận xoá người dùng"
                        visible={deleteModalVisible}
                        onOk={() => {
                            // Xử lý logic xoá người dùng ở đây
                            handleDelete(deletingUserId);
                            setDeleteModalVisible(false);
                        }}
                        onCancel={() => setDeleteModalVisible(false)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <p>Bạn có chắc chắn muốn xoá người dùng này?</p>
                    </Modal>
                </>
            )}
        </div>

    );
};
export default MngUser;