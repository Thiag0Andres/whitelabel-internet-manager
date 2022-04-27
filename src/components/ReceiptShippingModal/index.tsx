/* eslint-disable react/require-default-props */
import React, { FormEvent } from 'react';

import { Modal } from 'react-bootstrap';
import { Button } from '@material-ui/core';

// Icons
import { Icon } from '@iconify/react';
import Clock from '@iconify-icons/bi/clock';
import Download from '@iconify-icons/bi/download';
import XIcon from '@iconify-icons/bi/x';

import './styles.scss';

interface Props {
  value: boolean;
  handleClose: () => void;
  url: string;
}

const ReceiptShippingModal: React.FC<Props> = ({
  value,
  handleClose,
  url,
}: Props) => {
  const submitUrl = () => {
    window.open(`${url}`, '_blank_');
    handleClose();
  };

  // console.log(url);

  return (
    <Modal
      className="modal-shipping"
      show={value}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Icon icon={Clock} color="#011A2C" />
      </Modal.Header>
      <Modal.Body>
        <h2 className="subTitle marginBottom">Gerando arquivo de remessa</h2>
        <h3 className="title-option">
          Aguarde um momento enquanto geramos o arquivo de remessa das suas
          notas fiscais.
        </h3>
      </Modal.Body>
      <Modal.Footer>
        <div className="container-body-buttons-modal">
          <Button
            style={{ marginRight: '0.625rem' }}
            className="primary-button outline-primary"
            onClick={() => handleClose()}
          >
            <div className="icon-button">
              <Icon icon={XIcon} color="#011A2C" />
            </div>
            Cancelar
          </Button>
          <Button
            className="primary-button"
            onClick={submitUrl}
            disabled={!(url !== '')}
          >
            <div className="icon-button">
              <Icon icon={Download} color="#ffffff" />
            </div>
            Salvar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptShippingModal;
