export const getUrl = () => {
    let base_url =
      process.env.NODE_ENV === "development"
        ? "localhost:3000"
        : process.env.NEXTAUTH_URL || "https://www.ownblog.xyz/";
  
    return base_url;
};