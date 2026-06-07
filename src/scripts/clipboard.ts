export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const legacyCopy = (document as unknown as { execCommand?: (command: string) => boolean }).execCommand;
      const copied = legacyCopy?.call(document, 'copy') ?? false;
      document.body.removeChild(textarea);
      return copied;
    } catch {
      return false;
    }
  }
}

export async function copyWithButtonFeedback(
  text: string,
  button: HTMLButtonElement,
  originalLabel: string,
  copiedLabel = 'Copied!'
): Promise<boolean> {
  const copied = await copyToClipboard(text);
  if (copied) {
    button.textContent = copiedLabel;
    setTimeout(() => {
      button.textContent = originalLabel;
    }, 1000);
  }
  return copied;
}
