import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { Transaction } from 'src/schemas/transaction.schema';
import { StarknetService } from 'src/starknet/starknet.service';

@Injectable()
export class TransactionsService implements OnModuleInit {
  private blockNumber = 0;
  private lastWrittenBlock = 0;
  constructor(
    private starknetService: StarknetService,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}
  async onModuleInit() {
    const latestBlock = await this.getLatestBlock();
    console.log('init fetch for latest block', latestBlock);
    this.blockNumber = latestBlock.result;
    this.lastWrittenBlock = latestBlock.result - 10;
  }
  async getLatestBlock() {
    try {
      const response = await this.starknetService.getLatestBlock();
      return response;
    } catch (error) {
      throw new HttpException(
        'Error fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async getTrxnsForBlock(blockNumber: number) {
    try {
      const response = await this.starknetService.getTrnsxForBlock(blockNumber);
      return response;
    } catch (error) {
      throw new HttpException(
        'Error fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async getTrxnsInfo(trxnsHash: string) {
    try {
      const response = await this.starknetService.getInfoForTrxns(trxnsHash);
      return response;
    } catch (error) {
      throw new HttpException(
        'Error fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async writeTransactionsToDb(transactions: any) {
    try {
      let bulkWriteOps = [];
      let commonData = {
        status: transactions.status,
        timeStamp: transactions.timestamp,
        blockNumber: transactions.block_number,
      };
      transactions.transactions.map((transaction) => {
        let transactionDoc = {
          ...commonData,
          hash: transaction.transaction_hash,
          type: transaction.type,
        };
        bulkWriteOps.push(transactionDoc);
      });
      const writeResponse =
        await this.transactionModel.insertMany(bulkWriteOps);
      this.lastWrittenBlock = transactions.block_number;
      console.log(writeResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllTrxns(skip: number, limit: number) {
    try {
      const response = await this.transactionModel
        .find()
        .sort({ timeStamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      return response;
    } catch (error) {
      throw new HttpException(
        'Error fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async pollForNewBlocks() {
    if (this.blockNumber > 0) {
      const response = await this.getLatestBlock(); //11
      console.log(
        'Polling for blocks: new block number = ',
        response.result,
        '\n',
        'previous block number = ',
        this.blockNumber,
        '\nlast written block number = ',
        this.lastWrittenBlock,
      );
      if (this.blockNumber > this.lastWrittenBlock) {
        this.blockNumber = response.result;
        while (this.lastWrittenBlock < this.blockNumber) {
          const transactions = await this.getTrxnsForBlock(
            this.lastWrittenBlock + 1,
          );
          await this.writeTransactionsToDb(transactions.result);
        }
      }
    }
  }
}
