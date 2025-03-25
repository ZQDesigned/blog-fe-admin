const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 确保脚本可以在任何目录下运行
const projectRoot = path.resolve(__dirname, '..');

// 根据当前环境选择对应的环境变量文件
const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(projectRoot, `.env.${env}`);
const defaultEnvFile = path.resolve(projectRoot, '.env');

// 复制对应环境的配置到 .env 文件
try {
  if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, defaultEnvFile);
    console.log(`已应用 ${env} 环境的配置`);
  } else {
    console.warn(`警告: 未找到 ${env} 环境的配置文件`);
  }
} catch (error) {
  console.error('复制环境配置文件时出错:', error);
  process.exit(1);
}

// 执行构建命令
try {
  console.log('开始构建...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('构建完成');
} catch (error) {
  console.error('构建失败:', error);
  process.exit(1);
} 