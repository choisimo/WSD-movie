import AppRoutes from "AppRoutes";
import { BrowserRouter as Router } from 'react-router-dom';
import Header from 'content/layout/header';


function App() {
  return (
    <div className="App">
      <Router>
          <Header />
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
