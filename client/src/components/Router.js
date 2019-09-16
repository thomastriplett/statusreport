// Router component that handles all routes of the application
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Report from './Report';
import NotFound from './NotFound';
import EditName from './admin/EditName';
import EditSelect from './admin/EditSelect';
import EditCourseInfo from './admin/EditCourseInfo';
import EditUser from './admin/EditUser';
import Login from './admin/Login';
import CourseRequest from './admin/CourseRequest';

const baseUrl = process.env.PUBLIC_URL;
const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={`${baseUrl}/`} component={App} />
      <Route path={`${baseUrl}/editname`} component={EditName} />
      <Route path={`${baseUrl}/editcourseinfo`} component={EditCourseInfo} />
      <Route path={`${baseUrl}/editselect`} component={EditSelect} />
      <Route path={`${baseUrl}/courserequest`} component={CourseRequest} />
      <Route path={`${baseUrl}/edituser`} component={EditUser} />
      <Route path={`${baseUrl}/report`} component={Report} />
      <Route path={`${baseUrl}/login`} component={Login} />
      <Route path={`${baseUrl}/*`} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);
export default Router;
