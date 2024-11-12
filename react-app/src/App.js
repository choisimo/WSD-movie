import AppRoutes from "AppRoutes";
import {BrowserRouter as Router, useLocation} from 'react-router-dom';
import Header from 'content/layout/header';
import Footer from 'content/layout/footer';
import './App.css';

function App() {

    return (
    <div className="App">
      <Router>
          <Header />
          <div className="app-content">
            <AppRoutes />
          </div>
          <Footer />
      </Router>
    </div>
  );
}

export default App;
