export function simulateUpload(onProgress: (progress: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    let progress = 0;
    onProgress(0);

    const interval = setInterval(() => {
      progress = Math.min(progress + 5, 100);
      onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 100);

    // Expose a way to trigger failure externally (for future use)
    // Currently always resolves successfully
    void reject; // suppress unused variable warning
  });
}
