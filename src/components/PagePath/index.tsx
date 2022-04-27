/* eslint-disable react/require-default-props */
import React from 'react';
import './styles.scss';

interface IProps {
  title: string;
  child?: string;
}

const PagePath: React.FC<IProps> = ({ title, child }: IProps) => {
  return (
    <div className="container-page-path">
      <div className="container-row">
        <h1 className="name-path">
          {title} {child ? `> ${{ child }}` : null}
        </h1>
      </div>
    </div>
  );
};

export default PagePath;
