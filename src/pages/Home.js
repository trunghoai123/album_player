import { Button } from 'react-bootstrap';
import { HiVideoCamera, HiTrash } from 'react-icons/hi2';
import { TiPlus } from 'react-icons/ti';
import Draggable from 'react-draggable'; // The default
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  initialColors,
  initialFonts,
  initialValue,
  obstacleSize,
} from '../variables';

const newTextValues = {
  id: '',
  text: 'Sample Text',
  size: 16,
  font: {
    ...initialFonts[0],
  },
  style: 'normal',
  x: 0,
  y: 0,
  color: {
    name: 'yellow',
    value: '#f7ec1a',
  },
};

function Home() {
  const fullLink = window.location.href;
  const url = new URL(fullLink);
  const [texts, setTexts] = useState(initialValue);
  const [selecting, setSelecting] = useState(texts[0]);
  const obstacleElement = useRef(null);
  const selectingElement = useRef(null);
  const selectingElementChild = useRef(null);
  const containerElement = useRef(null);

  const [params, setParams] = useState({
    width: url.searchParams.get('width'),
    height: url.searchParams.get('height'),
    obstacle: url.searchParams.get('obs'),
    obsSize: { x: 0, y: 0 },
  });

  useEffect(() => {
    const clickEvent = (e) => {
      const classes = e.target.getAttribute('class');
      if (classes) {
        if (
          classes.includes('main__container') ||
          classes.includes('main__frame') ||
          classes.includes('mdl-js') ||
          classes.includes('cannot__drop--area')
        ) {
          console.log('hello');
          setSelecting(null);
        }
      }
    };
    document.addEventListener('mousedown', clickEvent);

    // if (selecting?.id) {
    //   console.log('added event');
    //   document.addEventListener('mousedown', clickEvent);
    //   return () => {
    //     console.log('event was be removed');
    //     document.removeEventListener('mousedown', clickEvent);
    //   };
    // }
  }, []);

  useEffect(() => {
    const clonedParams = { ...params };
    obstacleSize.forEach((obs) => {
      if (obs.sizeName === clonedParams.obstacle) {
        clonedParams.obsSize.x = obs.width;
        clonedParams.obsSize.y = obs.height;
        setParams(clonedParams);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selecting) {
      if (texts.length !== 0) {
        const checkingRs = checkIsOutOfContainer();
        const obstacleElm = obstacleElement.current;
        const clonedTexts = [...texts];
        if (checkingRs.rs !== 0) {
          clonedTexts.forEach((item) => {
            if (item.id === selecting.id) {
              if (checkingRs.rs === 1) {
                item.x = checkingRs.contElm.w - checkingRs.childElm.w - 6; // border width of each element = 3px
              } else if (checkingRs.rs === 2) {
                item.y = checkingRs.contElm.h - checkingRs.childElm.h - 6;
              } else {
                item.x = checkingRs.contElm.w - checkingRs.childElm.w - 6;
                item.y = checkingRs.contElm.h - checkingRs.childElm.h - 6;
              }
              setTexts(clonedTexts);
            }
          });
        } else if (checkIsCanPlace() === false) {
          clonedTexts.forEach((item) => {
            if (item.id === selecting.id) {
              item.x = obstacleElm.offsetLeft + obstacleElm.offsetWidth;
              setTexts(clonedTexts);
            }
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecting?.font?.id, selecting?.size, selecting?.style, selecting?.text]);

  const handleDrag = (e, b) => {
    if (selecting) {
      const clonedTexts = [...texts];
      clonedTexts.forEach((item) => {
        if (item.id === selecting.id) {
          item.x = b.x;
          item.y = b.y;
          setTexts(clonedTexts);
        }
      });
    }
  };

  const handleChangeColor = (e) => {
    const newColor = e.currentTarget.getAttribute('data-value');
    const clonedTexts = [...texts];
    clonedTexts.forEach((item) => {
      if (item.id === selecting.id) {
        initialColors.forEach((color) => {
          if (newColor === color.name) {
            item.color = { ...color };
          }
        });
        setTexts(clonedTexts);
        setSelecting(item);
      }
    });
  };

  const handleStop = (e, n) => {
    const dragElm = n.node;
    const obstacleElm = obstacleElement.current;
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
          item.x = obstacleElm.offsetLeft + obstacleElm.offsetWidth;
          setTexts(clonedTexts);
        }
      });
    }
  };

  const checkPossibleToDrop = (dragElm, obstacleElm) => {
    const containerElm = containerElement.current;
    if (
      containerElm.offsetWidth - (obstacleElm.x + obstacleElm.w) <
      dragElm.w
    ) {
      return true;
    } else if (
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
    if (e.target.value.length < 60) {
      const clonedTexts = [...texts];
      clonedTexts.forEach((item) => {
        if (item.id === selecting.id) {
          item.text = e.target.value;
          setSelecting(item);
          setTexts(clonedTexts);
        }
      });
    }
  };

  const checkIsOutOfContainer = () => {
    const selectingElm = selectingElement.current;
    const selectingElemChild = selectingElementChild.current;
    const containerElm = containerElement.current;
    const childElm = {
      x: selectingElm.props.position.x,
      y: selectingElm.props.position.y,
      w: selectingElemChild.offsetWidth,
      h: selectingElemChild.offsetHeight,
    };
    const contElm = {
      x: containerElm.offsetLeft,
      y: containerElm.offsetTop,
      w: containerElm.offsetWidth,
      h: containerElm.offsetHeight,
    };
    if (
      childElm.x + childElm.w >= contElm.w - 6 &&
      childElm.y + childElm.h >= contElm.h - 6
    ) {
      return {
        rs: 3,
        childElm,
        contElm,
      };
    } else if (childElm.x + childElm.w >= contElm.w - 6) {
      return {
        // rs = 1, child appear on the right of parent
        // rs = 2, child appear on the bottom of parent
        // rs = 3, child appear on the right and bottom of parent
        rs: 1,
        childElm,
        contElm,
      };
    } else if (childElm.y + childElm.h >= contElm.h - 6) {
      return {
        rs: 2,
        childElm,
        contElm,
      };
    }
    return {
      rs: 0,
      childElm,
      contElm,
    };
  };

  const checkIsCanPlace = () => {
    const selectingElm = selectingElement.current;
    const obstacleElm = obstacleElement.current;
    const selectingElemChild = selectingElementChild.current;
    return checkPossibleToDrop(
      {
        x: selectingElm.props.position.x,
        y: selectingElm.props.position.y,
        w: selectingElemChild.offsetWidth,
        h: selectingElemChild.offsetHeight,
      },
      {
        x: obstacleElm.offsetLeft,
        y: obstacleElm.offsetTop,
        w: obstacleElm.offsetWidth,
        h: obstacleElm.offsetHeight,
      }
    );
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
    } else {
      setTexts([]);
      setSelecting(null);
    }
  };

  const handleAddText = (e) => {
    const clonedTexts = [...texts];
    const newText = { ...newTextValues, id: uuidv4() };
    clonedTexts.push(newText);
    setTexts(clonedTexts);
    setSelecting(newText);
  };

  const handleChangeSize = (e) => {
    if (selecting) {
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
    }
  };

  const handleClickChangeStyle = (e) => {
    if (selecting) {
      const newStyle = e.currentTarget.getAttribute('data-value');
      const clonedTexts = [...texts];
      clonedTexts.forEach((item) => {
        if (item.id === selecting.id) {
          item.style = newStyle;
          setTexts(clonedTexts);
          setSelecting(item);
        }
      });
    }
  };

  const handleChangeFont = (e) => {
    if (selecting) {
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
    }
  };

  return (
    <div className="App">
      <div className="header p-2 border-bottom border-1 d-flex">
        <div className="d-flex main__buttons">
          {/* <Button variant="outline-primary me-3">
            <HiVideoCamera size="20" className="me-1" /> View In AR
          </Button> */}
          <Button
            onClick={(e) => handleAddText(e)}
            variant="outline-success me-3 d-flex"
          >
            <TiPlus size="20" /> Text
          </Button>
          {selecting?.id && (
            <Button
              onClick={() => handleRemoveText()}
              variant="outline-danger me-3 d-flex button__remove"
            >
              <HiTrash size="20" /> Inlatura
            </Button>
          )}
        </div>
        {selecting?.id && (
          <div className="input__container d-flex">
            <div className="me-4 d-flex align-items-center">
              <label htmlFor="typingText" className="me-1">
                Continut:
              </label>
              <input
                autoComplete="off"
                name="textContent"
                className="input"
                id="typingText"
                value={selecting.text}
                onChange={(e) => handleChangeText(e)}
              />
            </div>
            <div className="me-4 d-flex align-items-center">
              <label htmlFor="textSize" className="me-1">
                Marime:
              </label>
              <input
                type="number"
                min={8}
                max={40}
                onChange={(e) => handleChangeSize(e)}
                value={selecting.size}
                className="input input__size"
                id="textSize"
              />
            </div>
            <div className="me-4 d-flex align-items-center">
              <label htmlFor="font" className="me-1">
                Font:
              </label>
              <select
                value={selecting.font.id}
                onChange={(e) => handleChangeFont(e)}
                className="input"
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
        )}
        {selecting?.id && (
          <div className="text__decoration d-flex align-items-center">
            <div className="decoration__styles d-flex align-items-center overflow-hidden">
              <div
                data-value="normal"
                onClick={(e) => handleClickChangeStyle(e)}
                className={`decoration__styles--tab py-1 ${
                  selecting?.style === 'normal' ? 'active' : ''
                }`}
              >
                Normal
              </div>
              <div
                data-value="bold"
                onClick={(e) => handleClickChangeStyle(e)}
                className={`decoration__styles--tab py-1 ${
                  selecting?.style === 'bold' ? 'active' : ''
                }`}
              >
                <b>Bold</b>
              </div>
              <div
                data-value="italic"
                onClick={(e) => handleClickChangeStyle(e)}
                className={`decoration__styles--tab py-1 ${
                  selecting?.style === 'italic' ? 'active' : ''
                }`}
              >
                <i>Italic</i>
              </div>
            </div>
          </div>
        )}
        {selecting?.id && (
          <div className="text__colors">
            {initialColors.map((item) => {
              return (
                <div
                  key={item?.value}
                  data-value={item?.name}
                  onClick={(e) => handleChangeColor(e)}
                  style={{ backgroundColor: item.value }}
                  className={`text__colors--item ${
                    selecting?.color?.name === item.name ? 'active' : ''
                  }`}
                ></div>
              );
            })}
          </div>
        )}
      </div>
      <main>
        <div className="main__container">
          <div
            style={{ width: params?.width || '', height: params?.height || '' }}
            ref={containerElement}
            className="main__frame"
          >
            {texts.length > 0 &&
              texts.map((item) => {
                return (
                  <Draggable
                    position={{ x: item?.x, y: item?.y }}
                    key={item?.id}
                    onDrag={handleDrag}
                    onStop={handleStop}
                    bounds="parent"
                    onMouseDown={() => handleMouseDown(item)}
                    ref={
                      selecting
                        ? item.id === selecting.id
                          ? selectingElement
                          : null
                        : null
                    }
                  >
                    <div
                      ref={
                        selecting
                          ? item.id === selecting.id
                            ? selectingElementChild
                            : null
                          : null
                      }
                      style={{
                        color: item?.color?.value,
                        fontSize: item?.size + 'px',
                        fontStyle:
                          item?.style === 'italic' ? 'italic' : 'normal',
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
            <div
              ref={obstacleElement}
              style={{
                width: params?.obsSize?.x || '5%',
                height: params?.obsSize?.y || '35%',
              }}
              className="cannot__drop--area"
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
