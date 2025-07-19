const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Nexium Project Servers...\n');

// Function to run a command
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Starting ${name}...`);
    
    const child = spawn(comm 