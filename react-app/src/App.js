import AppRoutes from "AppRoutes";
import {BrowserRouter as Router, useLocation} from 'react-router-dom';
import Header from 'content/layout/header';
import Footer from 'content/layout/footer';
import { ScrollPositionProvider } from "content/components/utility/position/scrollPositionProvider";
import  ScrollRestoration  from "content/components/utility/position/scrollRestoration";
import './App.css';

function App() {

    return (
    <div className="App">
      <Router>
          <ScrollPositionProvider>
              <ScrollRestoration />
              <Header />
              <div className="app-content">
                <AppRoutes />
              </div>
              <Footer />
          </ScrollPositionProvider>
      </Router>
    </div>
  );
}

export default App;
