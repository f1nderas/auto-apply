import { execSync } from 'child_process';
import { rmSync, cpSync, existsSync, readdirSync, writeFileSync } from 'fs';

const TEMP = 'client/src/shared/.gen-tmp';
const DEST = 'client/src/shared/dto';

execSync(
  [
    'openapi-generator-cli generate',
    '-i http://localhost:4200/api-json',
    '-g typescript-nestjs',
    `-o ${TEMP}`,
    '--global-property models',
    '--additional-properties=modelPropertyNaming=original,fileNaming=kebab-case',
  ].join(' '),
  { stdio: 'inherit' },
);

if (existsSync(DEST)) rmSync(DEST, { recursive: true });
cpSync(`${TEMP}/model`, DEST, { recursive: true });
rmSync(TEMP, { recursive: true });

const barrelExports = readdirSync(DEST)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => `export type * from './${f.replace('.ts', '')}';`)
  .join('\n');
writeFileSync(`${DEST}/index.ts`, barrelExports + '\n');

console.log(`✓ Types generated → ${DEST}`);
