import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const balanceWithFormat = {
        income: `${formatValue(response.data.balance.income)}`,
        outcome: `${formatValue(response.data.balance.outcome)}`,
        total: `${formatValue(response.data.balance.total)}`,
      };
      console.log('balanceWithFormat', balanceWithFormat);

      const transactionsWithFormat = response.data.transactions.map(
        (transaction: Transaction) => {
          const date = new Date(transaction.created_at);
          const signal = transaction.type === 'outcome' ? '-' : '';

          return {
            id: transaction.id,
            title: transaction.title,
            value: transaction.value,
            formattedValue: `${signal} ${formatValue(transaction.value)}`,
            formattedDate: date.toLocaleDateString('pt-br'),
            type: transaction.type,
            category: transaction.category,
            created_at: transaction.created_at,
          };
        },
      );
      setBalance(balanceWithFormat);
      setTransactions(transactionsWithFormat);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transition => (
                <>
                  {transition.type === 'income' ? (
                    <tr>
                      <td className="title">{transition.title}</td>
                      <td className="income">{transition.formattedValue}</td>
                      <td>{transition.category.title}</td>
                      <td>{transition.formattedDate}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="title">{transition.title}</td>
                      <td className="outcome">{transition.formattedValue}</td>
                      <td>{transition.category.title}</td>
                      <td>{transition.formattedDate}</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
