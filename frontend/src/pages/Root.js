import { Outlet } from 'react-router-dom';
import HeaderContainer from '../containers/common/HeaderContainer';

const RootLayout = () => {
  return (
    <>
      <HeaderContainer />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
