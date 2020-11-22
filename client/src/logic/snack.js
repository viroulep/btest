const updateSnack = (data, setSnack) => {
  const { success, message } = data;
  setSnack({
    open: true,
    severity: success ? 'success' : 'error',
    message,
  });
};

export { updateSnack };
