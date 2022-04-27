import React, { useState, useEffect } from 'react';
import './styles.scss';

import { Spinner } from 'react-bootstrap';
import { Link, Error, CheckCircle } from '@material-ui/icons';

interface MyProps {
  file: any;
}

interface UploadFile {
  file?: any;
  name?: string;
  readableSize?: string;
  preview?: string;
  progress?: any;
  uploaded?: boolean;
  error?: boolean;
  url?: string;
}

const FileList: React.FC<MyProps> = ({ file }: MyProps) => {
  const [uploadFile, setUploadFile] = useState<UploadFile>({});

  useEffect(() => {
    setUploadFile(file);
  }, [file]);

  return (
    <div className="container-fileList">
      <div className="fileInfo">
        <img src={uploadFile.preview} alt="imageUp" className="preview" />
        <div className="container-info">
          <strong>{uploadFile.name}</strong>
          <span>
            {uploadFile.readableSize}{' '}
            {!!uploadFile.url && <button type="button">Excluir</button>}
          </span>
        </div>
      </div>

      <div className="container-icons">
        {uploadFile.uploaded && uploadFile.error && (
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
          />
        )}
        {uploadFile.url && (
          <a
            href={uploadFile.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link style={{ marginRight: 8, color: '#222' }} />
          </a>
        )}
        {uploadFile.uploaded && <CheckCircle style={{ color: '#35af62' }} />}
        {uploadFile.error && <Error style={{ color: '#db324f' }} />}
      </div>
    </div>
  );
};

export default FileList;
