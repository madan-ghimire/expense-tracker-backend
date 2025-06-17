export const passwordResetTemplate = (link: string) => `
  <p>Click below to reset your password:</p>
  <a href="${link}">${link}</a>
  <p>This link will expire in 15 minutes.</p>
`;
