import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	// Health check endpoint
	app.getHttpAdapter().get('/health', (req, res) => {
		res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
	});
	
	await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

