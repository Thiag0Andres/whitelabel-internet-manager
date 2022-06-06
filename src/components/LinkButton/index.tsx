import React from 'react';
import './styles.scss';

interface MyProps {
  id: string;
  title: string;
  onClick: () => void;
}

const LinkButton: React.FC<MyProps> = ({ id, title, onClick }: MyProps) => {
  return (
    <button id={id} className="link-button" type="button" onClick={onClick}>
      {title}
    </button>
  );
};

export default LinkButton;
