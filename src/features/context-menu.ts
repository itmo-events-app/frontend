function calculatePosition(clientX: number, clientY: number, mut: HTMLDivElement): { left: number, top: number } {
  const width = mut.offsetWidth;
  const height = mut.offsetHeight;

  let left = clientX - width
  let top = clientY

  if (top + height > window.innerHeight) {
    top = window.innerHeight - height;
  }

  if (left < 0) {
    left = 0;
  }

  return {
    left: left,
    top: top
  }
}

export { calculatePosition }
