import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

export interface PrivateRouteType {
  component: React.FC;
  path: string;
  exact: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteType> = (
  props: PrivateRouteType,
) => {
  const { isAuthenticated } = useSelector(
    (state: ApplicationState) => state.auth,
  );
  const { component, path, exact } = props;

  return isAuthenticated ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
