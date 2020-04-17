import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const reduced = transactions.reduce(
      (acc, { type, value }) => ({
        ...acc,
        [type]: Number(acc[type]) + Number(value),
      }),
      { income: 0, outcome: 0 },
    );

    const { income, outcome } = reduced;

    const balance = {
      ...reduced,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
