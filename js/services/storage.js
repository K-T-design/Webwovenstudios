export const saveToSheets = async (profileData) => {
  // Mock API call to Google Sheets backend
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saved to Google Sheets:', profileData);
      resolve({ success: true, id: Date.now().toString() });
    }, 1000);
  });
};
