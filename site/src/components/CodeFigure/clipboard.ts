function copyWithTextareaFallback(value: string) {
  if (typeof document === 'undefined') {
    throw new Error('Clipboard is not available.');
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const didCopy = document.execCommand?.('copy') ?? false;

    if (!didCopy) {
      throw new Error('Copy command failed.');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

export async function copyText(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  copyWithTextareaFallback(value);
}
