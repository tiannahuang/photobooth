function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string = "photobooth.jpg"
) {
  const url = canvas.toDataURL("image/jpeg", 0.92);
  triggerDownload(url, filename);
}

export function downloadBlob(blob: Blob, filename: string = "photobooth.webm") {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}
