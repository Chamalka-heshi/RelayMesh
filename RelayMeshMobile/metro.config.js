// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Automatically load environment variables from the root .env file
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (e) {
  // Dotenv fallback
}

const config = getDefaultConfig(__dirname);

module.exports = config;
