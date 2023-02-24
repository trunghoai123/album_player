import React from 'react';

const ColorSelection = ({
  data = '',
  handleClick = () => {},
  colorValue = '',
  isActive = false,
  ...rest
}) => {
  return (
    <div
      data-value={data}
      onClick={handleClick}
      style={{ backgroundColor: colorValue }}
      className={`text__colors--item ${isActive ? 'active' : ''}`}
      {...rest}
    ></div>
  );
};

export default ColorSelection;
