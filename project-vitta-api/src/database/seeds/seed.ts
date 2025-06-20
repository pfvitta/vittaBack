
import { connectionSource  } from '../../config/typeorm';
import { seedSpecialties } from './specialty.seed';

connectionSource.initialize()
  .then(async (dataSource) => {
    console.log('🌱 Ejecutando seed...');
    await seedSpecialties(dataSource);
    await dataSource.destroy();
  })
  .catch((err) => { 
    console.error('❌ Error ejecutando seed:', err);
  });
