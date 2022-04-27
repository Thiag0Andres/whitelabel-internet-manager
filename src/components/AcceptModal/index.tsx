/* eslint-disable react/require-default-props */
import React, { FormEvent } from 'react';

import { Modal } from 'react-bootstrap';
import { Button } from '@material-ui/core';

// Icons
import { Icon } from '@iconify/react';
import check2 from '@iconify-icons/bi/check2';
import XIcon from '@iconify-icons/bi/x';

import './styles.scss';

interface Props {
  value: boolean;
  handleClose: () => void;
  updateUser: (event: FormEvent) => void;
  confirmPassword?: string;
}

const AcceptModal: React.FC<Props> = ({
  value,
  handleClose,
  updateUser,
  confirmPassword,
}: Props) => {
  return (
    <Modal
      className="modal-accept"
      show={value}
      onHide={() => handleClose()}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h2 className="subTitle">Deseja continuar? {confirmPassword || ''}</h2>
      </Modal.Header>
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
          <Button className="primary-button" onClick={updateUser}>
            <div className="icon-button">
              <Icon icon={check2} color="#ffffff" />
            </div>
            Confirmar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AcceptModal;
