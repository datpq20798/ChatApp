import './App.css';
// import Login from './components/Login';
// import Login2 from './components/Login/register';
import Login from './components/Login/login';
import IndexAdmin from './components/Admin/IndexAdmin';
import Register from './components/Login/register';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route component={Login} path='/login' />
            <Route component={Register} path='/register' />
            <Route component={IndexAdmin} path='/sysadmin' />
            <Route component={ChatRoom} path='/' />
            
          </Switch>
          <AddRoomModal />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
