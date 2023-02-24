import { Button as MainButton } from 'react-bootstrap';

const Button = ({ handleClick = () => {}, variant = '', children }) => {
  return (
    <MainButton onClick={handleClick} variant={variant}>
      {children}
    </MainButton>
  );
};

export default Button;
