import { Action, Transaction } from "near-api-js/lib/transaction";

export type CreateTransactionOptions = {
  receiverId: string;
  actions: Action[];
  nonceOffset?: number;
}

export interface TransactionCreator {
  create(option: CreateTransactionOptions): Promise<Transaction>;
}
