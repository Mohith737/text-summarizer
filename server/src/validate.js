export function validateInput(text) {
  if (typeof text !== "string") {
    return { valid: false, error: "Text must be a string." };
  }

  const trimmedText = text.trim();

  if (!trimmedText) {
    return { valid: false, error: "Text cannot be empty." };
  }

  if (trimmedText.length < 10) {
    return { valid: false, error: "Text must be at least 10 characters long." };
  }

  return { valid: true, error: null };
}