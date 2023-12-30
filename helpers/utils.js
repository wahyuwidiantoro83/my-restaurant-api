const templateResponse = (rc, success, message, result, error) => {
  return {
    rc,
    success,
    message,
    result,
    error,
  };
};
module.exports = { templateResponse };
