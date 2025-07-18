exports.isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

exports.isStrongPassword = (password) => {
  // At least 6 chars, one number, one letter
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
}; 