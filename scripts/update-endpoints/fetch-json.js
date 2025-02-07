const { writeFileSync } = require("fs");
const path = require("path");

const { graphql } = require("@octokit/graphql");
const prettier = require("prettier");

const QUERY = `
  {
    endpoints {
      name
      scope(format: CAMELCASE)
      id(format: CAMELCASE)
      method
      url
      parameters {
        alias
        allowNull
        deprecated
        description
        enum
        name
        type
        required
      }
    }
  }`;

main();

async function main() {
  const { endpoints } = await graphql(QUERY, {
    url: "https://octokit-routes-graphql-server.now.sh/"
  });

  writeFileSync(
    path.resolve(__dirname, "generated", "endpoints.json"),
    prettier.format(JSON.stringify(endpoints), {
      parser: "json"
    })
  );
}
