import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { authRoutes, publicRoutes } from '../routes';
import { INavbar } from './Navbar/Navbar';
import Footer from './Footer/Footer';

const AppLayout = (obj: INavbar) => (
  <>
    <Navbar title={obj.title} loading={obj.loading} />
    <Outlet />
    <Footer />
  </>
);
const AppRouter = (obj: INavbar) => {
  let isAuth = true;
  let router = createBrowserRouter([{
    element: <AppLayout title={obj.title} loading={obj.loading} />,
    children: (isAuth ? [...authRoutes, ...publicRoutes] : publicRoutes),
  }])
  return (<RouterProvider router={router} />);
};

export default AppRouter;