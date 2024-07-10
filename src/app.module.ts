import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { StarknetService } from './starknet/starknet.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TransactionsModule],
  controllers: [AppController],
  providers: [AppService, StarknetService],
})
export class AppModule {}
