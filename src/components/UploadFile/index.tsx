/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import React from 'react';
import Dropzone from 'react-dropzone';

// Icons
import { Icon } from '@iconify/react';
import CardImageIcon from '@iconify-icons/bi/card-image';

import './styles.scss';

interface Myprops {
  onUpload: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const UploadFile: React.FC<Myprops> = ({ onUpload }: Myprops) => {
  const renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) {
      return (
        <p className="dropMessage">
          Arraste e solte sua imagem, ou clique aqui para inserir
        </p>
      );
    }

    if (isDragReject) {
      return <p className="dropMessage error"> Arquivo não suportado </p>;
    }

    return <p className="dropMessage success">Solte o arquivo aqui</p>;
  };

  return (
    <Dropzone accept="image/*" onDropAccepted={onUpload}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <div
          {...getRootProps()}
          className={
            isDragReject
              ? 'dropContainer reject'
              : isDragActive
              ? 'dropContainer active'
              : 'dropContainer'
          }
        >
          <input {...getInputProps()} />
          <Icon icon={CardImageIcon} color="#CCD1E6" />
          {renderDragMessage(isDragActive, isDragReject)}
        </div>
      )}
    </Dropzone>
  );
};

export default UploadFile;
