const API_URL = () => {
  if (typeof window !== "undefined") {
    console.log('window.__CONFIG__', (window as any).__CONFIG__);
    return (window as any).__CONFIG__?.API_URL;
  }
  return null;
};

export { API_URL };
