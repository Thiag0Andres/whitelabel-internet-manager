import React from 'react';
import './styles.scss';

interface MyProps {
  title: string;
  onClick: () => void;
}

const LinkButton: React.FC<MyProps> = ({ title, onClick }: MyProps) => {
  return (
    <button className="link-button" type="button" onClick={onClick}>
      {title}
    </button>
  );
};

export default LinkButton;
