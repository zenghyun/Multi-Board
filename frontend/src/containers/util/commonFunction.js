export const setLocalStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.log('localStorage is not working');
  }
};


