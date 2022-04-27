import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import Iframe from 'react-iframe';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';

import { ContainerPage, PagePath } from '../../components';

import { BillOfSale } from '../../services/types';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const ViewInvoice: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const [infoReceipt, setInfoReceipt] = useState<BillOfSale>();
  const [loading, setLoading] = useState(false);

  const id = window.location.pathname.substring(3).split('/')[3];

  const loadBillOfSale = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(`transactions/search?id=${id}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setInfoReceipt(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        // console.log(error.response);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }
        if (error.response.data.status === 401) {
          history.push('/login');
        }
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    loadBillOfSale();
  }, [loadBillOfSale]);

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  return (
    <ContainerPage>
      <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
        <PagePath title="Notas Fiscais" />
        <div className="card-header">
          <Button
            className="primary-button outline-primary"
            onClick={() => {
              onNavigationClick('/home/bill-of-sale');
            }}
          >
            <div className="icon-button">
              <Icon icon={arrowLeft} color="#59971f" />
            </div>
            Voltar
          </Button>
        </div>
        <div className="card-content">
          {!loading ? (
            <>
              <h2 className="subTitle marginBottom">
                Nota {infoReceipt?.receipt.receiptNumber}
              </h2>
              <Row noGutters className="container-body-pdf">
                <Iframe
                  url={String(infoReceipt?.receipt.receiptUrl)}
                  className="pdfViewer"
                />
              </Row>
            </>
          ) : (
            <div className="container-spinner">
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </Col>
    </ContainerPage>
  );
};

export default ViewInvoice;
