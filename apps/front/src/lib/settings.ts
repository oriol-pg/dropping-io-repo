const API_URL = () => {
  if (typeof window !== "undefined") {
    return (window as any).__CONFIG__?.API_URL;
  }
  return null;
};

export { API_URL };
