import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://127.0.0.1:4000/graphql",
  documents: ["./src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/__generated__/": {
      preset: "client"
    }
  }
};

export default config;
