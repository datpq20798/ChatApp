import React, { useState, useContext } from 'react';
import { Row, Col, Button, Input, message } from 'antd';
import firebase, { auth } from '../../firebase/config';
import './login.css';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument, generateKeywords } from '../../firebase/services';
import { getNextUserKey } from '../../firebase/services';
import { set } from 'lodash';

const googleProvider = new firebase.auth.GoogleAuthProvider();



export default function Login() {

  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading


  const handelAdmin = (e) => {
    const emailAdmin = 'admin@gmail.com'
    const passAdmin = '123456'
    setEmail(emailAdmin)
    setPassword(passAdmin)
  }
  const handleLogin = async () => {
    setIsLoading(true); // Khi bắt đầu đăng nhập, set isLoading thành true
    try {
      await auth.signInWithEmailAndPassword(email, password);
      message.success('Đăng nhập thành công.');
    } catch (error) {
      console.error('Error logging in: ', error.message);
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
    } finally {
      setIsLoading(false); // Sau khi xử lý đăng nhập xong, set isLoading thành false
    }
  };
  const handleRegistrationClick = () => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!user.uid) {
      history.push('/register');
    } else {

    }
  };
  const handleLoginWithFb = async (provider) => {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
    try {
      if (additionalUserInfo?.isNewUser) {
        const nextUserKey = await getNextUserKey(); // Lấy key tiếp theo từ Firestore
        addDocument('users', {
          key: nextUserKey,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          keywords: generateKeywords(user.displayName?.toLowerCase()),
        });
      }
      message.success('Đăng nhập thành công.');
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
    }
  };
  return (
    <>
      <div className="login-container">
        <Row justify='center' style={{ height: '100vh' }}>
          <Col span={8} className="login-form">
            <span className='title-header'>Login Chat</span>
            <div className="social-icons">
              <button className="icon" onClick={() => handleLoginWithFb(googleProvider)}><i className="fa-brands fa-google-plus-g" /></button>
              <button className="icon"><i className="fa-brands fa-facebook-f" /></button>
              <button className="icon"><i className="fa-brands fa-github" /></button>
              <button className="icon"><i className="fa-brands fa-linkedin-in" /></button>
              <button className="icon" onClick={handelAdmin} >Ad</button>

            </div>
            <span className='title-content'>Hoặc dùng tài khoản email để đăng nhập</span>
            <br />
            <br />
            <Input
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            <Input.Password
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <span style={{ float: 'right' }}>Bạn chưa có tài khoản?<Button onClick={handleRegistrationClick} type='link'>Đăng ký</Button></span>
            <Button
              className="login-button"
              onClick={handleLogin}
              loading={isLoading} // Sử dụng prop loading để hiển thị loading khi isLoading là true
            >
              Đăng nhập
            </Button>

          </Col>
        </Row>
      </div>
    </>
  );
}
