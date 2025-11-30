const { ClientProxyFactory, Transport } = require('@nestjs/microservices');
const { firstValueFrom } = require('rxjs');

const client = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'], // or your RabbitMQ URL
    queue: 'auth_queue',             // must match AUTH_QUEUE in .env
    queueOptions: { durable: true },
  },
});

async function test() {
  // Test signup
  const signupDto = {
    email: 'testuser@example.com',
    password: 'testpassword',
  };
  try {
    const signupResult = await firstValueFrom(client.send({ cmd: 'signup' }, signupDto));
    console.log('Signup result:', signupResult);
  } catch (err) {
    console.error('Signup error:', err.message);
  }

  // Test login
  const loginDto = {
    email: 'testuser@example.com',
    password: 'testpassword',
  };
  try {
    const loginResult = await firstValueFrom(client.send({ cmd: 'signin' }, loginDto));
    console.log('Login result:', loginResult);
  } catch (err) {
    console.error('Login error:', err.message);
  }

  client.close();
}

test();
