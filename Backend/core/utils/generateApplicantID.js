export const generateApplicantID = (lastNumber) => {
  const next = (lastNumber || 0) + 1;
  return `APP-${String(next).padStart(6, "0")}`;
};