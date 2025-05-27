import bcrypt from 'bcryptjs';

async function generateHash(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    throw error;
  }
}

// Se o script for executado diretamente
if (import.meta.main) {
  const password = process.argv[2];
  if (!password) {
    console.error('Please provide a password as an argument');
    process.exit(1);
  }

  generateHash(password)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} 