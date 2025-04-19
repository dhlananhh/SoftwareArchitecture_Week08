import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AddTutorial from './components/add-tutorial.component';
import Tutorial from './components/tutorial.component';
import TutorialsList from './components/tutorials-list.component';

const App = () => {
  return (
    <Router>
      <div>
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
          <Link to='/tutorials' className='navbar-brand'>
            TutorialsApp
          </Link>
          <div className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link to='/tutorials' className='nav-link'>
                Tutorials
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/add' className='nav-link'>
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className='container mt-3'>
          <Routes>
            <Route exact path={['/', '/tutorials']} element={<TutorialsList />} />
            <Route exact path='/add' element={<AddTutorial />} />
            <Route path='/tutorials/:id' element={<Tutorial />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
