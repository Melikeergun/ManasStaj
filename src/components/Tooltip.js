// Tooltip.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tooltip = ({ visible, x, y, value, label }) => {
  if (!visible) return null;

  return (
    <View style={[styles.tooltip, { left: x, top: y }]}>
      <Text style={styles.tooltipText}>{label}: {value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    color: '#fff',
  },
});

export default Tooltip;
