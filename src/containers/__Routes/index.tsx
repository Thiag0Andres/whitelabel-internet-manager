import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {
  Login,
  ForgotPassword,
  Home,
  ViewUser,
  ViewServicePlans,
  RegisterServicePlans,
  ViewInvoice,
  ViewBillsToReceive,
  ViewAuditLog,
} from '..';
import { PrivateRoute } from '../_PrivateRoute';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/forgot-password" component={ForgotPassword} />

      <PrivateRoute exact path="/home/:option" component={Home} />

      {/* Users */}
      <PrivateRoute exact path="/home/clients/view/:id" component={ViewUser} />

      {/* Services Plans */}
      <PrivateRoute
        exact
        path="/home/service-plans/view/:id"
        component={ViewServicePlans}
      />
      <PrivateRoute
        exact
        path="/home/service-plans/create"
        component={RegisterServicePlans}
      />

      {/* Invoice */}
      <PrivateRoute
        exact
        path="/home/bill-of-sale/view/:id"
        component={ViewInvoice}
      />

      {/* Bills to Receive */}
      <PrivateRoute
        exact
        path="/home/bills-to-receive/view/:id"
        component={ViewBillsToReceive}
      />

      {/* Audit Log */}
      <PrivateRoute
        exact
        path="/home/audit-log/view/:id"
        component={ViewAuditLog}
      />

      <Redirect from="/" to="/home/dashboard" />
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
