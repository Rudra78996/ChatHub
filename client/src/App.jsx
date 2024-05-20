import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

const App = () => {
  return (
    <div>
      <header>
        <div id="heading">
          <h1 id="heading1">
            <div className="chat">Chat</div>
            <div className="hub">Hub</div>
          </h1>
        </div>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-custom bg-body-tertiary">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Video chat</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Voice call</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Messages</a>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Setting
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Action</a></li>
                      <li><a className="dropdown-item" href="#">Another action</a></li>
                      <div className="dropdown-divider"></div>
                      <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li>
                </ul>
                <form className="d-flex" role="search">
                  <button className="btn btn-outline-success" type="submit">Login</button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main className="container-custom">
      </main>
    </div>
  );
}

export default App;
