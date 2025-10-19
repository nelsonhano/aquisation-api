export const formatValidationErrors = (errors) => {
  if (!errors || !errors.issue) return 'Validation failed';

  if (Array.isArray(errors)) return errors.map(err => err.message).join(', ');

  JSON.stringify(errors);
};