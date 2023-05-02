export const getUrl = () => {
    let base_url =
      process.env.NODE_ENV === "development"
        ? "localhost:3000"
        : process.env.NEXTAUTH_URL || "localhost:3000"; // https://v2ds.netlify.app
  
    return base_url;
};