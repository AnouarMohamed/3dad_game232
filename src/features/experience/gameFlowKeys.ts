const FORM_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export const isAdvanceKey = (event: KeyboardEvent) =>
  event.key === 'Enter' || event.key === ' ';

export const isTypingTarget = (target: EventTarget | null): boolean => {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }
  return element.isContentEditable || FORM_TAGS.has(element.tagName);
};
