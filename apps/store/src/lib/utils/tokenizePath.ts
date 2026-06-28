type PathTokenValue = string | number | boolean;

type PathTokenValues = Record<string, PathTokenValue | null | undefined>;

const PATH_TOKEN_PATTERN = /\{([A-Za-z0-9_]+)\}/g;

export const tokenizePath = (path: string, values: PathTokenValues) =>
  path.replace(PATH_TOKEN_PATTERN, (_token, key: string) => {
    const value = values[key];

    if (value === null || value === undefined) {
      throw new Error(`Missing value for path token "${key}".`);
    }

    return encodeURIComponent(String(value));
  });
