export function getFromEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Not found. Please provide "${key}" in your .env file.`);
  } else {
    return value;
  }
}
