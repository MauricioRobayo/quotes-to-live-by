module.export = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    ["@semantic-release/github", , {
      "assets": [
        {"path": "app", "label": "Chrome extension"},
      ]
    }],
  ],
};
