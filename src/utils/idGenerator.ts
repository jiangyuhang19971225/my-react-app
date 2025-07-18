let idCounter = 0;

export default function useIdGenerator() {
  return () => {
    idCounter += 1;
    return `component-${idCounter}`;
  };
}
