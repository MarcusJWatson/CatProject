import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BrowserRouter as Router, 
  Routes,
  Route        
} from 'react-router-dom';
import { CreateAccountForm, CreateBuyerForm, CreateSellerForm, LoginForm, LoginScreenBase, Template } from './Login';
import './index.css';     

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
        <Routes>

          <Route exact path="/" element={<Template children={<LoginScreenBase children={<LoginForm/>}/>}/>}/>        
          <Route exact path="/SignUp" element={<Template children={<LoginScreenBase children={<CreateAccountForm/>}/>}/>}/>
          <Route exact path="/SignUp/SellerSignUp" element={<Template children={<LoginScreenBase children={<CreateSellerForm/>} />}/>}/>
          <Route exact path="/SignUp/BuyerSignUp" element={<Template children={<LoginScreenBase children={<CreateBuyerForm/>}/>}/>}/> 

          <Route path='*' element={"Page Not Found"}/>

          </Routes>
      </Router>



  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
