import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next v16 は flat config を直接 export するため、
// FlatCompat による旧 .eslintrc 形式からの変換は不要。
// 変換を挟むと eslint-plugin-react の循環参照を JSON 化しようとして
// "Converting circular structure to JSON" で lint が丸ごと死ぬ。
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
