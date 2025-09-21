export const getToken = async (): Promise<string> => {
  const response = await fetch("/api/authenticate", { cache: "no-store" });
  const result = await response.json();
  return result.access_token;
};
