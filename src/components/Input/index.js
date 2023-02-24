const Input = ({
  type = 'text',
  value = '',
  name = '',
  id = '',
  selecting = null,
  handleChange,
  className = '',
  ...rest
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      name={name}
      id={id}
      className={className}
      {...rest}
    />
  );
};

export default Input;
