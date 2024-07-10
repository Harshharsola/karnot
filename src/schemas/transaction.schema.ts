import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop()
  status: string;

  @Prop()
  blockNumber: number;

  @Prop()
  hash: string;

  @Prop()
  type: string;

  @Prop()
  timeStamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
