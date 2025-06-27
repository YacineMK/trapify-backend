import { Context, LoggerService } from "@domain/services/logger.service";
import { GuidiniApi } from "@infrastructure/guidini";
import { ResponseHandler } from '@application/interfaces/response';
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { Public } from "@application/decorators/isPublic.decorator";

@Controller('payment')
export class PaymentController {
    private Log: LoggerService = new LoggerService('PaymentController');

    @Public()
    @Post('checkout')
    async createPayment(@Body('amount') amount: number) {
        this.Log.logger('Creating payment', { module: 'PaymentController', method: 'createPayment' });
        try {
            const payment = await GuidiniApi.createPayment(amount);
            return ResponseHandler.success(payment, 'Payment created successfully', 'success', HttpStatus.CREATED);
        } catch (error) {
            this.Log.error('Error creating payment', error, { module: 'PaymentController', method: 'createPayment' });
            return ResponseHandler.error('Error creating payment', error.message || 'Unknown error', 'error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Public()
    @Get('verify')
    async verifyPayment(@Query('order_number') orderNumber: string) {
        const context: Context = {
            module: 'PaymentController',
            method: 'verifyPayment'
        };
        
        this.Log.logger('Verifying payment', context);
        
        try {
            // Pass the order number to the API
            const paymentData = await GuidiniApi.verifyPayment(orderNumber);
            
            // Process the payment verification result
            // ...
            
            return ResponseHandler.success(
                paymentData,
                'Payment verified successfully',
                'success',
                HttpStatus.OK
            );
        } catch (error) {
            this.Log.error('Error verifying payment', error, context);
            return ResponseHandler.error(
                'Error verifying payment',
                error.message || 'Unknown error',
                'error',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    @Get('wallet')
    async getCurrentWallet() {
        this.Log.logger('Fetching current wallet', { module: 'PaymentController', method: 'getCurrentWallet' });
        try{}catch{}

    }
}
