import React from 'react';
import {Routes, Route, redirect, createBrowserRouter, RouterProvider} from 'react-router-dom';
import {useRoutes }  from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';

const AppRouter = () => {
    let isAuth = false;
    let router = createBrowserRouter((isAuth?[...authRoutes, ...publicRoutes]:publicRoutes));
    return (<RouterProvider router={router} />);
};

export default AppRouter;