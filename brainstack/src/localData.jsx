
export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("token", token);
    }
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const getUserId = () => {
  try {
    return localStorage.getItem("user_id");
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export const setUserId = (user_id) => {
  try {
    if (user_id) {
      localStorage.setItem("user_id", user_id);
    }
  } catch (error) {
    console.error("Error setting user ID:", error);
  }
};

export const removeUserId = () => {
  try {
    localStorage.removeItem("user_id");
  } catch (error) {
    console.error("Error removing user ID:", error);
  }
};


export const getSelectedlangugae = () => {
  try {
    return localStorage.getItem("setSelectedlangugae");
  } catch (error) {
    console.error("Error getting language:", error);
    return null;
  }
};

export const setSelectedlangugae = (language) => {
  try {
    if (language) {
      localStorage.setItem("language", language);
    }
  } catch (error) {
    console.error("Error setting language:", error);
  }
};

export const removeSelectedlangugae = () => {
  try {
    localStorage.removeItem("language");
  } catch (error) {
    console.error("Error removing language:", error);
  }
};




export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== undefined && token !== "";
};



