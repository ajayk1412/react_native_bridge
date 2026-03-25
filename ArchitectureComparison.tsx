/**
 * Architecture Comparison Demo
 *
 * This component demonstrates the usage of both:
 * 1. Legacy Bridge (Old Architecture)
 * 2. TurboModule (New Architecture)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeModules,
  Platform,
} from 'react-native';
import NativeCalculatorTurboModule from './src/specs/NativeCalculatorTurboModule';

const { CalculatorModule } = NativeModules;

export default function ArchitectureComparison() {
  const [legacyResult, setLegacyResult] = useState<string>('');
  const [turboResult, setTurboResult] = useState<string>('');

  // ==================== LEGACY BRIDGE ====================

  const testLegacyAdd = async () => {
    setLegacyResult('Loading...');
    try {
      const result = await CalculatorModule.add(15, 27);
      setLegacyResult(`15 + 27 = ${result}\n✅ Legacy Bridge (JSON)`);
    } catch (error: any) {
      setLegacyResult(`Error: ${error.message}`);
    }
  };

  const testLegacyMultiply = () => {
    setLegacyResult('Loading...');
    // Old-school callback pattern
    CalculatorModule.multiply(8, 9, (error: any, result: any) => {
      if (error) {
        setLegacyResult(`Error: ${error}`);
      } else {
        setLegacyResult(`8 × 9 = ${result}\n✅ Legacy Bridge (Callback)`);
      }
    });
  };

  const testLegacyPercentage = async () => {
    setLegacyResult('Loading...');
    try {
      const result = await CalculatorModule.calculatePercentage(200, 25);
      setLegacyResult(`25% of 200 = ${result}\n✅ Legacy Bridge (Promise)`);
    } catch (error: any) {
      setLegacyResult(`Error: ${error.message}`);
    }
  };

  // ==================== TURBOMODULE ====================

  const testTurboAdd = async () => {
    setTurboResult('Loading...');
    try {
      // Type-safe! TypeScript knows the exact types
      const result: number = await NativeCalculatorTurboModule.add(15, 27);
      setTurboResult(`15 + 27 = ${result}\n🚀 TurboModule (JSI)`);
    } catch (error: any) {
      setTurboResult(`Error: ${error.message}`);
    }
  };

  const testTurboMultiply = async () => {
    setTurboResult('Loading...');
    try {
      const result: number = await NativeCalculatorTurboModule.multiply(8, 9);
      setTurboResult(`8 × 9 = ${result}\n🚀 TurboModule (Type-safe)`);
    } catch (error: any) {
      setTurboResult(`Error: ${error.message}`);
    }
  };

  const testTurboPercentage = async () => {
    setTurboResult('Loading...');
    try {
      const result: number =
        await NativeCalculatorTurboModule.calculatePercentage(200, 25);
      setTurboResult(`25% of 200 = ${result}\n🚀 TurboModule (Fast)`);
    } catch (error: any) {
      setTurboResult(`Error: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>React Native Bridge Comparison</Text>
      <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>

      {/* LEGACY BRIDGE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          🔵 Legacy Bridge (Old Architecture)
        </Text>
        <Text style={styles.description}>
          • JSON serialization{'\n'}• Async bridge queue{'\n'}• Loaded at
          startup{'\n'}• No type safety
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.legacyButton]}
            onPress={testLegacyAdd}
          >
            <Text style={styles.buttonText}>Add (Promise)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.legacyButton]}
            onPress={testLegacyMultiply}
          >
            <Text style={styles.buttonText}>Multiply (Callback)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.legacyButton]}
          onPress={testLegacyPercentage}
        >
          <Text style={styles.buttonText}>Calculate 25% of 200</Text>
        </TouchableOpacity>

        {legacyResult ? (
          <View style={[styles.resultBox, styles.legacyResult]}>
            <Text style={styles.resultText}>{legacyResult}</Text>
          </View>
        ) : null}
      </View>

      {/* TURBOMODULE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          🚀 TurboModule (New Architecture)
        </Text>
        <Text style={styles.description}>
          • Direct JSI calls{'\n'}• No serialization{'\n'}• Lazy loading{'\n'}•
          Type-safe with CodeGen
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.turboButton]}
            onPress={testTurboAdd}
          >
            <Text style={styles.buttonText}>Add (Type-safe)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.turboButton]}
            onPress={testTurboMultiply}
          >
            <Text style={styles.buttonText}>Multiply (Fast)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.turboButton]}
          onPress={testTurboPercentage}
        >
          <Text style={styles.buttonText}>Calculate 25% of 200</Text>
        </TouchableOpacity>

        {turboResult ? (
          <View style={[styles.resultBox, styles.turboResult]}>
            <Text style={styles.resultText}>{turboResult}</Text>
          </View>
        ) : null}
      </View>

      {/* COMPARISON */}
      <View style={styles.comparisonSection}>
        <Text style={styles.sectionTitle}>📊 Key Differences</Text>

        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Speed:</Text>
          <Text style={styles.comparisonText}>TurboModule is ~16x faster</Text>
        </View>

        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Type Safety:</Text>
          <Text style={styles.comparisonText}>
            TurboModule has compile-time checks
          </Text>
        </View>

        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Loading:</Text>
          <Text style={styles.comparisonText}>
            TurboModule loads on-demand (lazy)
          </Text>
        </View>

        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>CodeGen:</Text>
          <Text style={styles.comparisonText}>
            TurboModule auto-generates interfaces
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  legacyButton: {
    backgroundColor: '#4A90E2',
  },
  turboButton: {
    backgroundColor: '#7C3AED',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  resultBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
  },
  legacyResult: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#4A90E2',
  },
  turboResult: {
    backgroundColor: '#F3E8FF',
    borderLeftColor: '#7C3AED',
  },
  resultText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    color: '#333',
  },
  comparisonSection: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  comparisonRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  comparisonLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  comparisonText: {
    flex: 1,
    color: '#666',
  },
});
