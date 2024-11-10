import AppRoutes from "./AppRoutes";
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
