import { HiTrash } from 'react-icons/hi2';
import { TiPlus } from 'react-icons/ti';
import Draggable from 'react-draggable';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initialColors, initialFonts, initialValue } from '../variables';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import PrinterUtil from '../utils/printerUtils';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Option from '../components/Option';
import StyleButton from '../components/StyleButtons';
import ColorSelection from '../components/ColorSelection';

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
    name: 'gold',
    value: '#FFD700',
  },
  dms: {
    //dimension
    width: 0,
    height: 0,
  },
};

function Home() {
  const [printMode, setPrintMode] = useState(false);

  const [coverImage, setCoverImage] = useState();

  const [printedFileBlob, setPrintedFileBlob] = useState();

  let zip;
  const fullLink = window.location.href;
  const url = new URL(fullLink);
  const [texts, setTexts] = useState(initialValue);
  const [selecting, setSelecting] = useState(texts[0]);
  const obstacleElement = useRef(null);
  const selectingElement = useRef(null);
  const selectingElementChild = useRef(null);
  const containerElement = useRef(null);
  // ?width=1200px&height=350px&obs=8x8&obsTop=20&obsLeft=50
  const [params, setParams] = useState({
    size: url.searchParams.get('size'),
    width: url.searchParams.get('width'),
    height: url.searchParams.get('height'),
    color: url.searchParams.get('color') || 'white',
    obstacle: true,
    obsTop: '55.5555',
    obsLeft: '22.499',
    aspectRatio:
      url.searchParams.get('size') === '30x30' ? '24.5/4.5' : '19/2.5',
    // aspectRatio: url.searchParams.get('apr'),
    rightObstacle: url.searchParams.get('size') !== '30x30',
    obsSize: { x: 0, y: 0 },
  });

  // useEffect(() => {
  //   if (printMode) {
  //     setTimeout(() => {
  //       printEditor();
  //     }, 300);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [printMode]);

  useEffect(() => {
    const clickEvent = (e) => {
      const classes = e.target.getAttribute('class');
      if (classes) {
        if (
          classes.includes('main__container') ||
          classes.includes('main__frame') ||
          classes.includes('mdl-js') ||
          classes.includes('cannot__drop--area') ||
          classes.includes('App')
        ) {
          setSelecting(null);
        }
      }
    };
    document.addEventListener('mousedown', clickEvent);
  }, []);

  // useEffect(() => {
  //   const clonedParams = { ...params };
  //   if (params?.obstacle === 'true') {
  //   }
  //   obstacleSize.forEach((obs) => {
  //     if (obs.sizeName === clonedParams.obstacle) {
  //       clonedParams.obsSize.x = obs.width;
  //       clonedParams.obsSize.y = obs.height;
  //       setParams(clonedParams);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (selecting) {
      if (texts.length !== 0) {
        const checkingRs = checkIsOutOfContainer();
        const obstacleElm = obstacleElement.current;
        const clonedTexts = [...texts];
        if (checkIsCanPlace() === false && params?.rightObstacle) {
          clonedTexts.forEach((item) => {
            if (item.id === selecting.id) {
              item.x =
                obstacleElm.offsetLeft -
                selectingElementChild.current.offsetWidth;
            }
          });
          setTexts(clonedTexts);
        } else if (checkingRs.rs !== 0) {
          clonedTexts.forEach((item) => {
            if (item.id === selecting.id) {
              if (checkingRs.rs === 1) {
                item.x = checkingRs.contElm.w - checkingRs.childElm.w; // border width of each element = 3px
              } else if (checkingRs.rs === 2) {
                item.y = checkingRs.contElm.h - checkingRs.childElm.h;
              } else {
                item.x = checkingRs.contElm.w - checkingRs.childElm.w;
                item.y = checkingRs.contElm.h - checkingRs.childElm.h;
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
  // before add background
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     printEditor();
  //   }, 300);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   texts,
  //   selecting,
  //   selecting?.font?.id,
  //   selecting?.size,
  //   selecting?.style,
  //   selecting?.text,
  //   selecting?.font?.id,
  //   selecting?.color?.id,
  //   selecting?.x,
  //   selecting?.y,
  // ]);
  const printEditor = () => {
    zip = new JSZip();
    const editor = document.querySelector('#main_frame');
    if (editor) {
      // editor.style.backgroundColor = 'transparent';
      let scaleFactor = ((PrinterUtil.width / 2.54) * 300) / editor.clientWidth;
      html2canvas(editor, {
        backgroundColor: null,
        scale: scaleFactor,
      }).then(function (canvas) {
        canvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        canvas.toBlob(function (data) {
          try {
            setCoverImage(new File([data], '18360.png'));
            zip.file(`18360/18360.png`, data);
            zip.generateAsync({ type: 'blob' }).then((content) => {
              setPrintedFileBlob(() => {
                saveAs(content, '18360.zip');
                return content;
              });
              setPrintMode(false);
              // setTimeout(() => {
              //   saveAs(printedFileBlob, '18360.zip');
              // }, 2000);
            });
          } catch (e) {
            console.log(e);
          }
        }, 'image/png');
      });
    }
  };
  useEffect(() => {
    console.log(printMode);
    const editor = document.querySelector('.second__container');
    if (printMode) {
      editor.classList.add('printing');
      printEditor();
    } else {
      editor.classList.remove('printing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printMode]);

  const handleApplyStyle = () => {
    // use to post message
    const message = {
      name: 'uploadFileEditor',
      file: new File([printedFileBlob], '18360.zip'),
      image: coverImage,
      blobImg: printedFileBlob,
    };
    // eslint-disable-next-line no-restricted-globals
    window.parent.postMessage(message, window.location.origin);

    setPrintMode(true);
    // setTimeout(() => {
    //   saveAs(printedFileBlob, '18360.zip');
    // }, 2000);
  };

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
          if (params?.rightObstacle) {
            item.x =
              obstacleElm.offsetLeft -
              selectingElementChild.current.offsetWidth;
          } else {
            item.x = obstacleElm.offsetLeft + obstacleElm.offsetWidth;
          }
          setTexts(clonedTexts);
        }
      });
    }
  };

  const checkPossibleToDrop = (dragElm, obstacleElm) => {
    const containerElm = containerElement.current;
    if (
      containerElm.offsetWidth - (obstacleElm.x + obstacleElm.w) < dragElm.w &&
      !params?.rightObstacle
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
      childElm.x + childElm.w >= contElm.w &&
      childElm.y + childElm.h >= contElm.h
    ) {
      return {
        rs: 3,
        childElm,
        contElm,
      };
    } else if (childElm.x + childElm.w >= contElm.w) {
      return {
        // rs = 1, child appear on the right of parent
        // rs = 2, child appear on the bottom of parent
        // rs = 3, child appear on the right and bottom of parent
        rs: 1,
        childElm,
        contElm,
      };
    } else if (childElm.y + childElm.h >= contElm.h) {
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
    let curColor = {};
    const clonedTexts = [...texts];
    initialColors.forEach((color) => {
      if (color?.name === params?.color) {
        curColor = { ...color };
      }
    });
    const newText = { ...newTextValues, id: uuidv4(), color: { ...curColor } };
    clonedTexts.push(newText);
    setTexts(clonedTexts);
    setSelecting(newText);
  };

  const handleChangeSize = (e) => {
    if (selecting) {
      const newSize = Number.parseInt(e.target.value);
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

  // !params ? (
  //   <div className="loading_slt">
  //     <div className="loading_text">Loading...</div>
  //   </div>
  // ) :
  return (
    <div className="App">
      <div className="header p-2 border-bottom border-1 d-flex">
        <div className="d-flex main__buttons">
          <Button
            handleClick={(e) => handleAddText(e)}
            variant="outline-success me-3 d-flex"
          >
            <TiPlus size="20" /> Text
          </Button>
          {selecting?.id && (
            <Button
              handleClick={() => handleRemoveText()}
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
              <Input
                type="text"
                value={selecting.text}
                handleChange={(e) => handleChangeText(e)}
                name="textContent"
                id="typingText"
                className="input"
                autoComplete="off"
              ></Input>
            </div>
            <div className="me-4 d-flex align-items-center">
              <label htmlFor="textSize" className="me-1">
                Marime:
              </label>
              <Input
                type="number"
                value={selecting.size}
                onChange={(e) => handleChangeSize(e)}
                name="size"
                id="textSize"
                className="input input__size"
                min={8}
                max={40}
              ></Input>
            </div>
            <div className="me-4 d-flex align-items-center">
              <label htmlFor="font" className="me-1">
                Font:
              </label>
              <Select
                value={selecting.font.id}
                handleChange={(e) => handleChangeFont(e)}
                className="input"
                id="font"
              >
                {initialFonts.map((font) => {
                  return (
                    <Option
                      key={font?.id}
                      className="font__option"
                      value={font?.id}
                    >
                      {font?.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        )}
        {selecting?.id && (
          <div className="text__decoration d-flex align-items-center">
            <div className="decoration__styles d-flex align-items-center overflow-hidden">
              <StyleButton
                selecting={selecting?.style}
                handleClick={(e) => handleClickChangeStyle(e)}
              ></StyleButton>
            </div>
          </div>
        )}
      </div>
      <main>
        <div className="first__container">
          <div className="second__container">
            <div className="main__container">
              <div className="screen__container">
                <div className="screen"></div>
              </div>
              <div
                // style={{ width: params?.width || '80%', height: params?.height || '' }}
                style={{
                  width: params?.width || '100%',
                  aspectRatio: params?.aspectRatio || '17.29/2.5',
                }}
                ref={containerElement}
                className="main__frame"
                id="main_frame"
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
                          id={item.id}
                          style={{
                            color: item?.color?.value,
                            fontSize: item?.size + 'px',
                            fontStyle:
                              item?.style === 'italic' ? 'italic' : 'normal',
                            fontWeight:
                              item?.style === 'bold' ? 'bold' : 'normal',
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
                {params?.obstacle ? (
                  params?.rightObstacle ? (
                    <div
                      ref={obstacleElement}
                      style={{
                        height: '100%',
                        width: '9%',
                        top: '0%',
                        right: '0%',
                      }}
                      className="cannot__drop--area"
                    ></div>
                  ) : (
                    <div
                      ref={obstacleElement}
                      style={{
                        height: '33.33334%',
                        aspectRatio: 1,
                        top: params?.obsTop + '%',
                        left: params?.obsLeft + '%',
                      }}
                      className="cannot__drop--area"
                    ></div>
                  )
                ) : (
                  <div
                    ref={obstacleElement}
                    style={{
                      display: 'none',
                    }}
                    className="cannot__drop--area"
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <button
        onClick={handleApplyStyle}
        id="btn_apply"
        className="change_style btn_apply"
      >
        Print <i className="fa-regular fa-floppy-disk"></i>
      </button>
    </div>
  );
}

export default Home;
