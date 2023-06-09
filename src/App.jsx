
import "../node_modules/reactjs-popup/dist/index.css"
import './App.scss';

//Import components
import QuestionPage from './pages/QuestionPage';
import Login from './components/Login';
import HeaderNav from './components/HeaderNav';
import GlobalState from './context/GlobalState';

//Import modules
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';

import { auth } from './services/firebase';



function PrivateRoute({authenticated}) {
  return (
    authenticated === true ? (
      <>
      {/* pass globalstate only for headerNav */}
      <GlobalState><HeaderNav /></GlobalState> 
      <Outlet />
      </>
    )
   : (
    <Navigate
      to={{pathname:"/"}}
      />
  )
  );
}

function PublicRoute({authenticated}) {
  return (
    authenticated === false ? (
      <Outlet />
    ) : (
      <Navigate to="/question" />
    )
  );
}


function App() {

  //Define states
  const [authenticated, setAuthenticated] = useState(false);

  useEffect( () => {

    onAuthStateChanged(auth, (user) => {
      if(user){
        setAuthenticated(true)
      }else {
        setAuthenticated(false)
      }
    })
  }, []);

  return (
    <div>
      <Router>
        <Routes>

          <Route exact path='/' element={<PublicRoute authenticated={authenticated} />} >
            <Route exact path='/' element={<Login />}></Route>
          </Route>

          <Route path='/question' element={<PrivateRoute authenticated={authenticated} />} >
            <Route exact path='/question' element={<QuestionPage />}></Route>
          </Route>

        </Routes>
        </Router>
    </div>
  );
}

export default App;
