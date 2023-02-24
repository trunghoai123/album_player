import React from 'react';

const StyleButton = ({ handleClick = () => {}, selecting = '' }) => {
  return (
    <>
      <div
        data-value="normal"
        onClick={handleClick}
        className={`decoration__styles--tab py-1 ${
          selecting === 'normal' ? 'active' : ''
        }`}
      >
        Normal
      </div>
      <div
        data-value="bold"
        onClick={handleClick}
        className={`decoration__styles--tab py-1 ${
          selecting === 'bold' ? 'active' : ''
        }`}
      >
        <b>Bold</b>
      </div>
      <div
        data-value="italic"
        onClick={handleClick}
        className={`decoration__styles--tab py-1 ${
          selecting === 'italic' ? 'active' : ''
        }`}
      >
        <i>Italic</i>
      </div>
    </>
  );
};

export default StyleButton;
