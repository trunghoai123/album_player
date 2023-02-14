import './assets/styles/App.scss';
import './assets/styles/fonts.css';
import { Button } from 'react-bootstrap';
import { HiVideoCamera, HiTrash } from 'react-icons/hi2';
import { TiPlus } from 'react-icons/ti';
import Draggable from 'react-draggable'; // The default
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initialFonts, initialValue } from './variables';

function App() {
  const [texts, setTexts] = useState(initialValue);
  const [selecting, setSelecting] = useState(texts[0]);
  const obstacleElement = useRef(null);
  const selectingElement = useRef(null);
  const handleDrag = (e, b) => {
    const clonedTexts = [...texts];
    clonedTexts.forEach((item) => {
      if (item.id === selecting.id) {
        item.x = b.x;
        item.y = b.y;
        setTexts(clonedTexts);
      }
    });
  };

  const handleStop = (e, n) => {
    const dragElm = n.node;
    const obstacleElm = obstacleElement.current;
    // console.log(e.target);
    // console.log(e.target.offsetLeft);
    // console.log(n.x);
    const rs = checkPossibleToDrop(
      {
        x: n.x,
        y: n.y,
        w: dragElm.offsetWidth,
        h: dragElm.offsetHeight,
      },
      {
        x: obstacleElm.offsetLeft,
        y: obstacleElm.offsetTop,
        w: obstacleElm.offsetWidth,
        h: obstacleElm.offsetHeight,
      }
    );
    if (!rs) {
      const clonedTexts = [...texts];
      clonedTexts.forEach((item) => {
        if (item.id === selecting.id) {
          item.x = obstacleElm.offsetLeft + obstacleElm.offsetWidth + 0;
          // item.y = obstacleElm.offsetTop + obstacleElm.offsetHeight;
          setTexts(clonedTexts);
        }
      });
    }
  };

  const checkPossibleToDrop = (dragElm, obstacleElm) => {
    if (
      dragElm.x + dragElm.w < obstacleElm.x ||
      dragElm.y + dragElm.h < obstacleElm.y ||
      dragElm.x > obstacleElm.x + obstacleElm.w ||
      dragElm.y > obstacleElm.y + obstacleElm.h
    ) {
      return true;
    }
    return false;
  };

  const handleMouseDown = (item) => {
    setSelecting(item);
  };

  const handleChangeText = (e) => {
    const clonedTexts = [...texts];
    clonedTexts.forEach((item) => {
      if (item.id === selecting.id) {
        setSelecting({ ...item, text: e.target.value });
        item.text = e.target.value;
        setTexts(clonedTexts);
      }
    });

    const selectingElm = selectingElement.current;
    const obstacleElm = obstacleElement.current;
    console.log(selectingElement);
    console.log({
      x: selectingElm.props.position.x,
      y: selectingElm.props.position.y,
      w: selectingElm.offsetWidth,
      h: selectingElm.offsetHeight,
    });
    console.log({
      x: obstacleElm.offsetLeft,
      y: obstacleElm.offsetTop,
      w: obstacleElm.offsetWidth,
      h: obstacleElm.offsetHeight,
    });
    const rs = checkPossibleToDrop(
      {
        x: selectingElm.props.position.x,
        y: selectingElm.props.position.y,
        w: selectingElm.offsetWidth,
        h: selectingElm.offsetHeight,
      },
      {
        x: obstacleElm.offsetLeft,
        y: obstacleElm.offsetTop,
        w: obstacleElm.offsetWidth,
        h: obstacleElm.offsetHeight,
      }
    );
    console.log(rs);
  };

  const handleRemoveText = (e) => {
    const newTexts = [];
    if (texts.length > 1) {
      texts.forEach((item) => {
        if (item.id !== selecting.id) {
          newTexts.push(item);
        }
      });
      setTexts(newTexts);
      setSelecting(newTexts[0]);
    }
  };

  const handleAddText = (e) => {
    const clonedTexts = [...texts];
    const newText = {
      id: uuidv4(),
      text: 'Type Your Text Here',
      size: 16,
      font: {
        ...initialFonts[0],
      },
      style: 'normal',
      x: 0,
      y: 0,
    };
    clonedTexts.push(newText);
    setTexts(clonedTexts);
    setSelecting(newText);
  };

  const handleChangeSize = (e) => {
    const newSize = e.target.value;
    if (newSize === 'e' || newSize < 8 || newSize > 70) {
      return;
    }
    const clonedTexts = [...texts];
    clonedTexts.forEach((item) => {
      if (item.id === selecting.id) {
        item.size = newSize;
        setTexts(clonedTexts);
        setSelecting(item);
      }
    });
  };

  const handleClickChangeStyle = (e) => {
    const newStyle = e.currentTarget.getAttribute('data-value');
    const clonedTexts = [...texts];
    clonedTexts.forEach((item) => {
      if (item.id === selecting.id) {
        item.style = newStyle;
        setTexts(clonedTexts);
        setSelecting(item);
      }
    });
  };

  const handleChangeFont = (e) => {
    const newFontId = Number.parseInt(e.currentTarget.value);
    const clonedTexts = [...texts];
    clonedTexts.forEach((item) => {
      if (item.id === selecting.id) {
        initialFonts.forEach((font) => {
          if (newFontId === font.id) {
            item.font = { ...font };
          }
        });
        setTexts(clonedTexts);
        setSelecting(item);
      }
    });
  };

  return (
    <div className="App">
      <div className="header p-2 border-bottom border-1 d-flex">
        <div className="d-inline-block">
          <Button variant="outline-primary me-3">
            <HiVideoCamera size="20" className="me-1" /> View In AR
          </Button>
          <Button
            onClick={(e) => handleAddText(e)}
            variant="outline-success me-3"
          >
            <TiPlus size="20" /> Add New Text
          </Button>
          <Button
            onClick={() => handleRemoveText()}
            variant="outline-danger me-3"
          >
            <HiTrash size="20" /> Remove Text
          </Button>
        </div>
        <div className="input__container d-flex">
          <div className="me-4">
            <label htmlFor="typingText" className="me-1">
              Content:
            </label>
            <input
              autoComplete="off"
              name="textContent"
              className="input h-100 border-rounded"
              id="typingText"
              value={selecting.text}
              onChange={(e) => handleChangeText(e)}
            />
          </div>
          <div className="me-4">
            <label htmlFor="textSize" className="me-1">
              Size:
            </label>
            <input
              type="number"
              min={8}
              onChange={(e) => handleChangeSize(e)}
              value={selecting?.size}
              className="input input__size h-100 border-rounded"
              id="textSize"
            />
          </div>
          <div className="me-4">
            <label htmlFor="font" className="me-1">
              Font:
            </label>
            <select
              value={selecting?.font?.id}
              onChange={(e) => handleChangeFont(e)}
              className="input h-100 border-rounded"
              id="font"
            >
              {initialFonts.map((font) => {
                return (
                  <option
                    key={font?.id}
                    className="font__option"
                    value={font?.id}
                  >
                    {font?.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="text__decoration d-flex align-items-center">
          <div className="decoration__styles d-flex align-items-center overflow-hidden">
            <div
              data-value="bold"
              onClick={(e) => handleClickChangeStyle(e)}
              className={`decoration__styles--tab p-2 ${
                selecting?.style === 'bold' ? 'active' : ''
              }`}
            >
              <b>Bold</b>
            </div>
            <div
              data-value="italic"
              onClick={(e) => handleClickChangeStyle(e)}
              className={`decoration__styles--tab p-2 ${
                selecting?.style === 'italic' ? 'active' : ''
              }`}
            >
              <i>Italic</i>
            </div>
            <div
              data-value="normal"
              onClick={(e) => handleClickChangeStyle(e)}
              className={`decoration__styles--tab p-2 ${
                selecting?.style === 'normal' ? 'active' : ''
              }`}
            >
              Normal
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="main__container">
          <div className="main__frame">
            {texts.map((item) => {
              return (
                <Draggable
                  position={{ x: item?.x, y: item?.y }}
                  key={item?.id}
                  onDrag={handleDrag}
                  onStop={handleStop}
                  bounds="parent"
                  onMouseDown={() => handleMouseDown(item)}
                  ref={item.id === selecting.id ? selectingElement : null}
                >
                  <div
                    style={{
                      fontSize: item?.size + 'px',
                      fontStyle: item?.style === 'italic' ? 'italic' : 'normal',
                      fontWeight: item?.style === 'bold' ? 'bold' : 'normal',
                      fontFamily: item?.font?.name,
                    }}
                    className={`displayedText ${
                      item?.id === selecting?.id ? 'selected' : ''
                    }`}
                  >
                    {item?.text}
                  </div>
                </Draggable>
              );
            })}
            <div ref={obstacleElement} className="cannot__drop--area"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
