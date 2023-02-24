const Select = ({
  value = '',
  handleChange = () => {},
  className = '',
  id = '',
  children = '',
}) => {
  return (
    <select value={value} onChange={handleChange} className={className} id={id}>
      {children}
    </select>
  );
};
export default Select;
