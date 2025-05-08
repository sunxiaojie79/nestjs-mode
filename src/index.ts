import AppDataSource from '../ormconfig';
import { User } from './user/user.entity';

AppDataSource.initialize()
  .then(async () => {
    const users = await AppDataSource.manager.find(User);

    console.log(
      'Here you can setup and run express / fastify / any other framework.',
      users,
    );
  })
  .catch((error) => console.log(error));
