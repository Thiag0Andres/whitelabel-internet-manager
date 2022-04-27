import React from 'react';

import { BrowserRouter, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Routes from '../__Routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Routes />
        </Switch>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
