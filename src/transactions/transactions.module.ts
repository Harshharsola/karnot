import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { StarknetService } from 'src/starknet/starknet.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [TransactionsService, StarknetService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
