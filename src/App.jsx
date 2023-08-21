import './App.css'
import React from "react";
import Header from "./components/Header";
import Controlado from './components/FormControlado';

const App = () => {

  return (
    <React.Fragment>
      <div className="container">
          <Header />
          <div className="row">
            <Controlado />
          </div>
      </div>
    </React.Fragment>
  );
};

export default App;
