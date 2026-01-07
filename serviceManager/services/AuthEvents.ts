// Simple event emitter for auth-related events (authExpired, etc.)
class AuthEventEmitter {
  private static instance: AuthEventEmitter;
  private listeners: { [key: string]: (() => void)[] } = {};

  public static getInstance(): AuthEventEmitter {
    if (!AuthEventEmitter.instance) {
      AuthEventEmitter.instance = new AuthEventEmitter();
    }
    return AuthEventEmitter.instance;
  }

  public on(event: string, callback: () => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: () => void): void {
    if (!this.listeners[event]) return;

    const index = this.listeners[event].indexOf(callback);
    if (index > -1) {
      this.listeners[event].splice(index, 1);
    }
  }

  public emit(event: string): void {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in auth event listener:", error);
      }
    });
  }

  public clear(): void {
    this.listeners = {};
  }
}

export default AuthEventEmitter;
