import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const eslintConfig = [
    {
        ignores: ["./src/components/ui/**"]
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "react/display-name": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    disallowTypeAnnotations: false
                }
            ]
        }
    }
];

export default eslintConfig;
