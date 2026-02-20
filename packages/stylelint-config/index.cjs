/** @type {import("stylelint").Config} */
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],

  customSyntax: "postcss-scss",

  rules: {
    /**
     * ─────────────────────────────
     * Tailwind / shadcn compatibility
     * ─────────────────────────────
     */
    "at-rule-no-unknown": null,
    "no-descending-specificity": null,
    "selector-class-pattern": null,

    /**
     * ─────────────────────────────
     * Prevent bad CSS
     * ─────────────────────────────
     */
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
    "no-duplicate-selectors": true,
    "no-empty-source": true,

    /**
     * ─────────────────────────────
     * Maintainable CSS rules
     * ─────────────────────────────
     */
    "selector-max-id": 0,
    "max-nesting-depth": 3,
    "selector-max-specificity": "0,3,0",

    /**
     * ─────────────────────────────
     * Prevent anti-patterns
     * ─────────────────────────────
     */
    "declaration-no-important": true,
    "shorthand-property-no-redundant-values": true,
  },

  ignoreFiles: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
  ],
};
