import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import { logout } from '../../modules/user';
import { getUser } from '../selectors';

const HeaderContainer = () => {
  const user = useSelector(getUser); // user 선택자 함수
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
