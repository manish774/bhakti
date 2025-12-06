import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ServiceManager from "../serviceManager/ServiceManager";

export default function NetworkDebugger() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addLog("🔄 Starting connection test...");

    try {
      const serviceManager = ServiceManager.getInstance();
      const result = await serviceManager.testConnection();

      if (result) {
        addLog("✅ Connection test PASSED");
      } else {
        addLog("❌ Connection test FAILED");
      }
    } catch (error: any) {
      addLog(`💥 Connection test ERROR: ${error.message}`);
    }

    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    addLog("🔄 Testing login endpoint...");

    try {
      const serviceManager = ServiceManager.getInstance();
      await serviceManager.login({ email: "test@test.com", password: "test" });
      addLog("✅ Login endpoint reachable");
    } catch (error: any) {
      addLog(`❌ Login test: ${error.message}`);
    }

    setIsLoading(false);
  };

  const testSignup = async () => {
    setIsLoading(true);
    addLog("🔄 Testing signup endpoint...");

    try {
      const serviceManager = ServiceManager.getInstance();
      await serviceManager.signup({
        name: "Test",
        email: "test@test.com",
        password: "test",
      });
      addLog("✅ Signup endpoint reachable");
    } catch (error: any) {
      addLog(`❌ Signup test: ${error.message}`);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Debugger</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={testSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearLogs}
        >
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
        {logs.length === 0 && (
          <Text style={styles.noLogsText}>
            No logs yet. Press a test button above.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    minWidth: 100,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  logContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 10,
  },
  logText: {
    color: "#00FF00",
    fontFamily: "monospace",
    fontSize: 12,
    marginBottom: 5,
  },
  noLogsText: {
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
});
