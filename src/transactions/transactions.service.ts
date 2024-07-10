import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StarknetService } from 'src/starknet/starknet.service';

@Injectable()
export class TransactionsService {
  constructor(private starknetService: StarknetService) {}
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
}
