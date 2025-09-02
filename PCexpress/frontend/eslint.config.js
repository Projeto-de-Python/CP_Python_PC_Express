import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  // Arquivos ignorados
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.min.js",
      "*.bundle.js",
      ".env*",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "coverage/**",
      ".nyc_output/**",
      ".cache/**",
      ".parcel-cache/**"
    ]
  },

  // Configuração base do JavaScript
  js.configs.recommended,

  // Configuração para JavaScript/JSX com React
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { 
      react: pluginReact
    },
    languageOptions: { 
      globals: {...globals.browser, ...globals.node},
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // Regras específicas do React
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "warn",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      
      // Regras gerais de qualidade
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];
