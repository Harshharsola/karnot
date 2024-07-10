import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class StarknetService {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Replace "<project-id>" with your actual project ID
    this.baseUrl = `https://starknet-mainnet.blastapi.io/${this.configService.get('PROJECT_ID')}`;
  }

  getLatestBlock = async () => {
    try {
      const body = {
        jsonrpc: '2.0',
        method: 'starknet_blockNumber',
        params: [],
        id: 0,
      };
      const headers = { 'Content-Type': 'application/json' };
      console.log(process.env.PROJECT_ID);
      const response = await axios.post(this.baseUrl, body, { headers });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  };

  getTrnsxForBlock = async (blockNumber: number) => {
    try {
      const body = {
        jsonrpc: '2.0',
        method: 'starknet_getBlockWithTxs',
        params: [
          {
            block_number: blockNumber,
          },
        ],
        id: 0,
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await axios.post(this.baseUrl, body, { headers });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  };
}
