// 用法：npm run pub            （自动写提交说明）
//      npm run pub "改了关于页"
// 只提交内容目录：src/content、src/topics、src/site.ts、public。先构建，构建不过不会推送。
import { execFileSync } from 'node:child_process';

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...opts });
const out = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();

const paths = ['src/content', 'src/topics', 'src/site.ts', 'public'];
if (!out('git', ['status', '--porcelain', '--', ...paths])) {
  console.log('内容没有改动，不用发布。');
  process.exit(0);
}
try {
  run('npm', ['run', 'build', '--silent']);
} catch {
  console.error('\n构建没通过，没有发布。把上面的报错发给 Claude 看。');
  process.exit(1);
}
run('git', ['add', '--', ...paths]);
const msg = process.argv[2] || `content: 更新内容 ${new Date().toISOString().slice(0, 10)}`;
run('git', ['commit', '-q', '-m', msg]);
run('git', ['push', '-q', 'origin', 'main']);
console.log('\n已推送。一分钟左右后在 https://waveryu.com 生效。');
