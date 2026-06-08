import app from './app';
import { envVars } from './config/env';

async function main() {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`University Medical Center Server listening on port ${envVars.PORT}`);
    });
  } catch (err) {
    console.log('Server Error:', err);
  }
}

main();
