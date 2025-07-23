export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const clearUserId = () => {
  localStorage.removeItem('userId');
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};