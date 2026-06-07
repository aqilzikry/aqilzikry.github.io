const createLogo = (name: string): string =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export { createLogo };
