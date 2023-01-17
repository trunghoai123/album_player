import { Button } from 'react-bootstrap';
import { HiVideoCamera, HiTrash } from 'react-icons/hi2';
import { TiPlus } from 'react-icons/ti';
import Draggable from 'react-draggable'; // The default
import { DraggableCore } from 'react-draggable';
import './App.scss';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [contState, setContState] = useState();
  return (
    <div className="App">
      <div className="header p-2 border-bottom border-1 d-flex">
        <div className="d-inline-block">
          <Button variant="outline-primary me-3">
            <HiVideoCamera size="20" className="me-1" /> View In AR
          </Button>
          <Button variant="outline-success me-3">
            <TiPlus size="20" /> Add New Text
          </Button>
          <Button variant="outline-danger me-3">
            <HiTrash size="20" /> Remove Text
          </Button>
        </div>
        <div className="input__container d-flex">
          <div className="me-4">
            <label htmlFor="typingText" className="me-1">
              Content:
            </label>
            <input className="input h-100 border-rounded" id="typingText" />
          </div>
          <div className="me-4">
            <label htmlFor="textSize" className="me-1">
              Size:
            </label>
            <input
              type="number"
              className="input input__size h-100 border-rounded"
              id="textSize"
            />
          </div>
          <div className="me-4">
            <label htmlFor="font" className="me-1">
              Font:
            </label>
            <select className="input h-100 border-rounded" id="font">
              <option className="font__option">Times new roman</option>
              <option className="font__option">Arial</option>
              <option className="font__option">Roboto</option>
            </select>
          </div>
        </div>
        <div className="text__decoration d-flex align-items-center">
          <div className="decoration__styles d-flex align-items-center overflow-hidden">
            <div className="decoration__styles--tab active p-2">
              <b>Bold</b>
            </div>
            <div className="decoration__styles--tab p-2">
              <i>Italic</i>
            </div>
            <div className="decoration__styles--tab p-2">Normal</div>
          </div>
        </div>
      </div>
      <main>
        <div className="main__container">
          <div className="main__frame">
            <Draggable bounds="parent">
              <div className="displayedText">I can now be moved around!</div>
            </Draggable>
            <Draggable bounds="parent">
              <div className="displayedText">Text is here</div>
            </Draggable>
            <Draggable bounds="parent">
              <div className="displayedText selected">Text is here</div>
            </Draggable>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
