import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';

import { Container, Row, Col, Spinner, Form } from 'react-bootstrap';

import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';

import { Bar } from 'react-chartjs-2';

// Icons
import { Icon } from '@iconify/react';
import chevronDown from '@iconify-icons/bi/chevron-down';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import { PagePath } from '../../components';

import { formatMonth, moneyFormat } from '../../services/mask';
import { ServicePlans, IReports, Provider } from '../../services/types';

import api from '../../services/api';

import { MONTHS_LIST, YEARS_LIST } from '../../constants/selects-options';

import './styles.scss';

enum TypeFIlter {
  AnnualBilling = 'getAnnualBilling',
  MonthlyBilling = 'getMonthlyBilling',
}

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const Dashboard: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<IReports[]>();
  const [userProvider, setUserProvider] = useState<Provider>();
  const [infoPlan, setInfoPlan] = useState<ServicePlans>();
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();
  const [annualBilling, setAnnualBilling] = useState<number>();
  const [annualBillingDataArr, setAnnualBillingDataArr] = useState<
    Array<number>
  >([]);
  const [monthlyBillingDataArr, setMonthlyBillingDataArrr] = useState<
    Array<number>
  >([]);

  useEffect(() => {
    const now = new Date();
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
  }, []);

  const loadPlan = useCallback(
    (id: number) => {
      // console.log('token', token);

      api
        .get(`/plans/search?type=provider&id=${String(id)}`, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data.data);
          setInfoPlan(response.data.data);
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
        });
    },
    [token],
  );

  const loadProvider = useCallback(() => {
    // console.log('token', token);
    api
      .get(`/providers/search?id=${user?.providerId}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setUserProvider(response.data.data);
        loadPlan(response.data.data.planId);
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
      });
  }, [token]);

  const loadAdminReports = useCallback(
    (type: string) => {
      // console.log('token', token);
      setLoading(true);

      api
        .get(
          `${
            type === 'getMonthlyBilling'
              ? `/reports?type=admin&month=${month}&year=${year}`
              : `/reports?type=admin&year=${year}`
          }`,
          {
            headers: { Authorization: token },
          },
        )
        .then(response => {
          // console.log('Reports Admin:', response.data.data);

          if (type === 'getAnnualBilling') {
            let value = 0;
            let valueMonth = 0;
            const arrayAnnual = Array(12).fill(0);
            const arrayMonthly = Array(12).fill(0);

            for (let i = 0; i < response.data.data.length; i += 1) {
              value += Number(response.data.data[i]?.liquidRevenues);
              const monthFormatted = formatMonth(
                response.data.data[i].createdAt,
              );
              arrayAnnual[parseInt(monthFormatted, 10) - 1] =
                response.data.data[i]?.liquidRevenues;

              if (parseInt(monthFormatted, 10) === Number(month)) {
                valueMonth = response.data.data[i]?.liquidRevenues;
              }
            }

            if (valueMonth > 0) {
              for (let i = 0; i < response.data.data.length; i += 1) {
                const monthFormatted = formatMonth(
                  response.data.data[i].createdAt,
                );
                arrayMonthly[parseInt(monthFormatted, 10) - 1] = valueMonth;
              }
            }

            setMonthlyBillingDataArrr(arrayMonthly);
            setAnnualBillingDataArr(arrayAnnual);
            setAnnualBilling(value);
          } else {
            setReports(response.data.data);
          }

          setLoading(false);
        })
        .catch(error => {
          // console.log(error.response);
          setLoading(false);
          if (error.response.data.error.error_description) {
            toast.error(`${error.response.data.error.error_description}`);
          } else {
            toast.error(`${error.response.data.error}`);
          }
          if (error.response.data.status === 401) {
            history.push('/login');
          }
        });
    },
    [token, month, year],
  );

  const loadProviderReports = useCallback(
    (type: string) => {
      // console.log('token', token);
      setLoading(true);

      api
        .get(
          `${
            type === 'getMonthlyBilling'
              ? `/reports?type=provider&providerId=${user?.providerId}&month=${month}&year=${year}`
              : `/reports?type=provider&providerId=${user?.providerId}&year=${year}`
          }`,
          {
            headers: { Authorization: token },
          },
        )
        .then(response => {
          // console.log('Reports Provider:', response.data.data);

          if (type === 'getAnnualBilling') {
            let value = 0;
            let valueMonth = 0;
            const arrayAnnual = Array(12).fill(0);
            const arrayMonthly = Array(12).fill(0);

            for (let i = 0; i < response.data.data.length; i += 1) {
              value += Number(response.data.data[i]?.revenues);
              const monthFormatted = formatMonth(
                response.data.data[i].createdAt,
              );
              arrayAnnual[parseInt(monthFormatted, 10) - 1] =
                response.data.data[i]?.revenues;

              if (parseInt(monthFormatted, 10) === Number(month)) {
                valueMonth = response.data.data[i]?.revenues;
              }
            }

            if (valueMonth > 0) {
              for (let i = 0; i < response.data.data.length; i += 1) {
                const monthFormatted = formatMonth(
                  response.data.data[i].createdAt,
                );
                arrayMonthly[parseInt(monthFormatted, 10) - 1] = valueMonth;
              }
            }

            setMonthlyBillingDataArrr(arrayMonthly);
            setAnnualBillingDataArr(arrayAnnual);
            setAnnualBilling(value);
          } else {
            setReports(response.data.data);
          }

          loadProvider();
          setLoading(false);
        })
        .catch(error => {
          // console.log(error.response);
          setLoading(false);
          if (error.response.data.error.error_description) {
            toast.error(`${error.response.data.error.error_description}`);
          } else {
            toast.error(`${error.response.data.error}`);
          }
          if (error.response.data.status === 401) {
            history.push('/login');
          }
        });
    },
    [token, user?.providerId, month, year],
  );

  useEffect(() => {
    if (month && year) {
      if (user.userType === 'globaladmin') {
        loadAdminReports(TypeFIlter.MonthlyBilling);
      } else {
        loadProviderReports(TypeFIlter.MonthlyBilling);
      }
    }
  }, [loadAdminReports, loadProviderReports, month, year]);

  useEffect(() => {
    if (year) {
      if (user.userType === 'globaladmin') {
        loadAdminReports(TypeFIlter.AnnualBilling);
      } else {
        loadProviderReports(TypeFIlter.AnnualBilling);
      }
    }
  }, [loadAdminReports, loadProviderReports, year]);

  const state = {
    labels: [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ],
    datasets: [
      {
        label: 'Período atual',
        backgroundColor: '#59971f',
        data: monthlyBillingDataArr,
      },
      {
        label: 'Período anterior',
        backgroundColor: '#9dc565',
        data: annualBillingDataArr,
      },
    ],
  };

  const handleInputChangeYear = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    // console.log(value);
    setYear(value);
  };

  const handleInputChangeMonth = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    // console.log(value);
    setMonth(value);
  };

  return (
    <Container fluid className="container-dashboard">
      <PagePath title="Painel de controle" />
      {!loading ? (
        <>
          {reports && reports.length ? (
            <Row noGutters>
              <Col className="container-card" lg="6">
                <div className="card-content">
                  <div className="content-title">
                    <h2
                      style={{ fontSize: '0.938rem' }}
                      className="subTitle marginBottom"
                    >
                      {user.userType === 'globaladmin'
                        ? 'Faturamento efetivo'
                        : 'Faturamento mensal'}
                    </h2>

                    <div className="container-select-dashboard">
                      <Form.Control
                        className="form-control-dashboard"
                        as="select"
                        name="year"
                        value={month}
                        onChange={handleInputChangeMonth}
                      >
                        {MONTHS_LIST.map(item => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Icon icon={chevronDown} color="#ccd1e6" />
                    </div>
                  </div>

                  <span className="infoText">
                    {user.userType === 'globaladmin' ? (
                      <>
                        {Number(reports[0]?.liquidRevenues)
                          ? moneyFormat(Number(reports[0]?.liquidRevenues))
                          : moneyFormat(0)}
                      </>
                    ) : (
                      <>
                        {Number(reports[0]?.revenues)
                          ? moneyFormat(Number(reports[0]?.revenues))
                          : moneyFormat(0)}
                      </>
                    )}
                  </span>
                  <Bar
                    data={state}
                    options={{
                      legend: {
                        position: 'top',
                        align: 'start',
                      },

                      responsive: true,
                    }}
                  />
                </div>
              </Col>
              <Col className="container-card isPadding" lg="6">
                {user.userType === 'globaladmin' && (
                  <div className="card-content">
                    <div className="content-title">
                      <h2
                        style={{ fontSize: '0.938rem' }}
                        className="subTitle marginBottom"
                      >
                        Estimativa de faturamento
                      </h2>
                    </div>

                    <span className="infoText">
                      {Number(reports[0]?.revenues)
                        ? moneyFormat(Number(reports[0]?.revenues))
                        : moneyFormat(0)}
                    </span>
                  </div>
                )}
                <div className="card-content">
                  <div className="content-title">
                    <h2
                      style={{ fontSize: '0.938rem' }}
                      className="subTitle marginBottom"
                    >
                      Faturamento anual
                    </h2>
                    <div className="container-select-dashboard">
                      <Form.Control
                        className="form-control-dashboard"
                        as="select"
                        name="year"
                        value={year}
                        onChange={handleInputChangeYear}
                      >
                        {YEARS_LIST.map(item => {
                          return (
                            <option key={item.id} value={item.value}>
                              {item.value}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Icon icon={chevronDown} color="#ccd1e6" />
                    </div>
                  </div>

                  <span className="infoText">
                    {annualBilling
                      ? moneyFormat(annualBilling)
                      : moneyFormat(0)}
                  </span>
                </div>
                {user.userType === 'provider' && (
                  <div className="card-content">
                    <h2
                      style={{ fontSize: '0.938rem' }}
                      className="subTitle marginBottom"
                    >
                      Total de clientes&nbsp;
                      <span className="active"> ativos</span>
                    </h2>
                    <span
                      style={{ marginBottom: '0.313rem' }}
                      className="infoText"
                    >
                      {Number(reports[0]?.compliantUsersCount) === 1
                        ? `${Number(reports[0]?.compliantUsersCount)} Cliente`
                        : `${Number(reports[0]?.compliantUsersCount)} Clientes`}
                    </span>
                    <p>
                      {Number(infoPlan?.maxClients) -
                        Number(reports[0]?.usersCount)}{' '}
                      vagas disponíveis no plano
                    </p>
                  </div>
                )}
                <div className="card-content">
                  <h2
                    style={{ fontSize: '0.938rem' }}
                    className="subTitle marginBottom"
                  >
                    {user.userType === 'globaladmin'
                      ? 'Total de provedores cadastrados'
                      : ' Total de clientes'}
                  </h2>
                  <span
                    style={{ marginBottom: '0.313rem' }}
                    className="infoText"
                  >
                    {user.userType === 'globaladmin' ? (
                      <>
                        {Number(reports[0]?.providersCount) === 1
                          ? `${Number(reports[0]?.providersCount)} Provedor`
                          : `${Number(reports[0]?.providersCount)} Provedores`}
                      </>
                    ) : (
                      <>
                        {Number(reports[0]?.usersCount) === 1
                          ? `${Number(reports[0]?.usersCount)} Cliente`
                          : `${Number(reports[0]?.usersCount)} Clientes`}
                      </>
                    )}
                  </span>
                  {user.userType === 'provider' && (
                    <p>
                      {Number(reports[0]?.usersCount) === 1
                        ? `${Number(
                            reports[0]?.usersCount,
                          )} cliente no último período`
                        : `${Number(
                            reports[0]?.usersCount,
                          )} clientes no último período`}
                    </p>
                  )}
                </div>
                {user.userType === 'provider' && (
                  <Row noGutters>
                    <Col className="container-card" lg="6">
                      <div className="card-content">
                        <h2
                          style={{ fontSize: '0.938rem' }}
                          className="subTitle marginBottom"
                        >
                          Clientes&nbsp;
                          <span className="blocked">bloqueados</span>
                        </h2>
                        <span className="infoText">
                          {Number(reports[0]?.inactiveUsersCount) === 1
                            ? `${Number(
                                reports[0]?.inactiveUsersCount,
                              )} Cliente`
                            : `${Number(
                                reports[0]?.inactiveUsersCount,
                              )} Clientes`}
                        </span>
                      </div>
                    </Col>
                    <Col className="container-card isPadding" lg="6">
                      <div className="card-content">
                        <h2
                          style={{ fontSize: '0.938rem' }}
                          className="subTitle marginBottom"
                        >
                          Clientes&nbsp;
                          <span className="defaulter">inadimplentes</span>
                        </h2>
                        <span className="infoText">
                          {Number(reports[0]?.defaultingUsersCount) === 1
                            ? `${Number(
                                reports[0]?.defaultingUsersCount,
                              )} Cliente`
                            : `${Number(
                                reports[0]?.defaultingUsersCount,
                              )} Clientes`}
                        </span>
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          ) : (
            <Row noGutters>
              <Col className="container-card" lg="6">
                <div className="card-content">
                  <div className="content-title">
                    <h2
                      style={{ fontSize: '0.938rem' }}
                      className="subTitle marginBottom"
                    >
                      {user.userType === 'globaladmin'
                        ? 'Faturamento efetivo'
                        : 'Faturamento mensal'}
                    </h2>
                    <div className="container-select-dashboard">
                      <Form.Control
                        className="form-control-dashboard"
                        as="select"
                        name="year"
                        value={month}
                        onChange={handleInputChangeMonth}
                      >
                        {MONTHS_LIST.map(item => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Icon icon={chevronDown} color="#ccd1e6" />
                    </div>
                  </div>
                  <h2 className="subTitle marginBottom">
                    Não existem registros para esse período
                  </h2>
                </div>
              </Col>

              <Col className="container-card isPadding" lg="6">
                <div className="card-content">
                  <div className="content-title">
                    <h2
                      style={{ fontSize: '0.938rem' }}
                      className="subTitle marginBottom"
                    >
                      Faturamento anual
                    </h2>
                    <div className="container-select-dashboard">
                      <Form.Control
                        className="form-control-dashboard"
                        as="select"
                        name="year"
                        value={year}
                        onChange={handleInputChangeYear}
                      >
                        {YEARS_LIST.map(item => {
                          return (
                            <option key={item.id} value={item.value}>
                              {item.value}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Icon icon={chevronDown} color="#ccd1e6" />
                    </div>
                  </div>
                  <h2 className="subTitle marginBottom">
                    Não existem registros para esse período
                  </h2>
                </div>
              </Col>
            </Row>
          )}
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
    </Container>
  );
};

export default Dashboard;
