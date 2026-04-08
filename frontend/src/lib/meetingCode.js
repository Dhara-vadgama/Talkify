// Generates a UUID-based meeting code
export function generateMeetingCode() {
    const hex = "0123456789abcdef";
    const pattern = [8, 4, 4, 4, 12];
  
    const parts = pattern.map((len) =>
      Array.from({ length: len }, () =>
        hex[Math.floor(Math.random() * 16)]
      ).join("")
    );
  
    return parts.join("-");
  }
  
  export function getMeetingShareUrl(code) {
    return `${window.location.origin}/${code}`;
  }