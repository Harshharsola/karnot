import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post('get-latest-block')
  async getLatestBlock(@Res() res) {
    const response = await this.transactionService.getLatestBlock();

    res.send(response);
  }

  @Get('get-trxns-block')
  async getTrxnsForBlock(
    @Query('block-number') blockNumber: string,
    @Res() res,
  ) {
    const response =
      await this.transactionService.getTrxnsForBlock(+blockNumber);

    res.send(response);
  }

  @Get('get-trxns-info')
  async getTrxnsInfo(@Query('hash') trxns: string, @Res() res) {
    const response = await this.transactionService.getTrxnsInfo(trxns);

    res.send(response);
  }
}
