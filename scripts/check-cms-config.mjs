// CMS 설정(public/admin/config.yml)이 실제 콘텐츠와 맞는지 검사한다.
//  - 콘텐츠 파일의 모든 필드가 설정에 있는지 (없으면 교수님이 폼에서 그 항목을 고칠 수 없다)
//  - select 필드의 기존 값이 옵션에 있는지 (없으면 폼에서 값이 깨져 보인다)
//  - 설정이 가리키는 폴더와 파일이 있는지
// 문제가 하나라도 있으면 종료 코드 1로 끝난다.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const config = YAML.parse(fs.readFileSync('public/admin/config.yml', 'utf8'));
const problems = [];
let checkedFiles = 0;

const parseEntry = (file, format) => {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (format === 'yaml') return { data: YAML.parse(text) ?? {}, hasBody: false };
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, hasBody: false };
  return { data: YAML.parse(m[1]) ?? {}, hasBody: m[2].trim().length > 0 };
};

// 필드 목록에 대해 data의 키와 select 값을 검사한다 (object 위젯은 안으로 들어간다)
const checkFields = (where, fields, data, hasBody) => {
  const byName = new Map(fields.map((f) => [f.name, f]));
  for (const [key, value] of Object.entries(data)) {
    const field = byName.get(key);
    if (!field) {
      problems.push(`${where}: 설정에 없는 필드 "${key}"`);
      continue;
    }
    if (field.widget === 'select' && value != null) {
      const allowed = field.options.map((o) => (typeof o === 'object' ? o.value : o));
      if (!allowed.includes(value)) problems.push(`${where}: "${key}" 값 "${value}"이 옵션(${allowed.join(', ')})에 없음`);
    }
    if (field.widget === 'object' && value && typeof value === 'object') {
      checkFields(`${where} > ${key}`, field.fields, value, false);
    }
  }
  if (hasBody && !byName.has('body')) problems.push(`${where}: 본문이 있는데 설정에 body 필드가 없음`);
};

for (const collection of config.collections) {
  if (collection.folder) {
    const dir = collection.folder.replace(/^\//, '');
    if (!fs.existsSync(dir)) {
      problems.push(`${collection.name}: 폴더가 없음 ${collection.folder}`);
      continue;
    }
    const ext = collection.extension ?? 'md';
    for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(`.${ext}`) && !f.startsWith('_'))) {
      const { data, hasBody } = parseEntry(path.join(dir, name), 'frontmatter');
      checkFields(`${collection.name}/${name}`, collection.fields, data, hasBody);
      checkedFiles++;
    }
  } else if (collection.files) {
    for (const f of collection.files) {
      const file = f.file.replace(/^\//, '');
      if (!fs.existsSync(file)) {
        problems.push(`${collection.name}/${f.name}: 파일이 없음 ${f.file}`);
        continue;
      }
      const { data, hasBody } = parseEntry(file, f.format === 'yaml' ? 'yaml' : 'frontmatter');
      checkFields(`${collection.name}/${f.name}`, f.fields, data, hasBody);
      checkedFiles++;
    }
  }
}

console.log(`CMS 설정 검사: 컬렉션 ${config.collections.length}개, 콘텐츠 파일 ${checkedFiles}개, 문제 ${problems.length}개`);
for (const p of problems.slice(0, 30)) console.log(`  - ${p}`);
process.exit(problems.length ? 1 : 0);
