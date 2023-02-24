const Option = ({ className = '', value = '', children = '', ...rest }) => {
  return (
    <option className={className} value={value} {...rest}>
      {children}
    </option>
  );
};

export default Option;
