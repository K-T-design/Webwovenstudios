export const generateShareLink = async (profileData) => {
  // Mock API call to generate a short link
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://profile.app/p/${Date.now().toString(36)}`);
    }, 500);
  });
};
