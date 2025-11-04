export const fixFormDataNull = (value) => {
    if (value === undefined || value === "undefined" || value === "null" || value === "") return null;
  return value;
}