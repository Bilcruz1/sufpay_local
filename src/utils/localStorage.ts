

export function setItem<T>(key: string, value: T): boolean {
  try {
    const jsonData = JSON.stringify(value);
      localStorage.setItem(key, jsonData);
      return true
    // console.log(`Data stored under key: ${key}`);
  } catch (error) {
      // console.error("Error saving data to localStorage:", error);
      return false
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const jsonData = localStorage.getItem(key);
    if (jsonData === null) return null;
    return JSON.parse(jsonData) as T;
  } catch (error) {
    // console.error("Error reading data from localStorage:", error);
    return null;
  }
}


export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true
    // console.log(`Data removed from key: ${key}`);
  } catch (error) {
    // console.error("Error removing data from localStorage:", error);
    return false
  }
}


export function clearAll(): boolean {
  try {
    localStorage.clear();
    return true
    // console.log("All data cleared from localStorage");
  } catch (error) {
    return false
    // console.error("Error clearing localStorage:", error);
  }
}
