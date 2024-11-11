import AppRoutes from "AppRoutes";
import { BrowserRouter as Router } from 'react-router-dom';
import Header from 'content/layout/header';
import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
          <Header />
          <div className="app-content">
            <AppRoutes />
          </div>
      </Router>
    </div>
  );
}

export default App;
