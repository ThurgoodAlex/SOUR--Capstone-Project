import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';

export function StatsBar() {
    return (
        <View style={StatStyles.statsSection}>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>2</Text>
                <Text style={TextStyles.p}>sales</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>2</Text>
                <Text style={TextStyles.p}>listings</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>20</Text>
                <Text style={TextStyles.p}>followers</Text>
            </View>
            <View style={Styles.center}>
                <Text style={[TextStyles.h2, { marginBottom: 0 }]}>1</Text>
                <Text style={TextStyles.p}>following</Text>
            </View>
        </View>
    );
}

const StatStyles = StyleSheet.create(
    {
        statsSection: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            marginBottom: 10,
        }
    }
);