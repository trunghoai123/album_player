import { Button } from 'react-bootstrap';
import { FaBeer } from 'react-icons/fa';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Button variant="outline-primary">
        <FaBeer /> Apply Text
      </Button>
    </div>
  );
}

export default App;
