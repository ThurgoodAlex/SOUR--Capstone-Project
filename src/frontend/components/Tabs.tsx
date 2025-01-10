import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { ScreenStyles, Styles, TextStyles } from '@/constants/Styles';


export function Tabs({ activeTab, handleTabSwitch, tab1, tab2 }:
        { activeTab: string; handleTabSwitch: (tab: string) => void, tab1: string, tab2:string }) {
    return (
        <View style={TabStyle.tabs}>
            <TouchableOpacity onPress={() => handleTabSwitch(tab1)}>
                <Text style={[
                    TextStyles.h2,
                    TabStyle.tab,
                    TextStyles.uppercase,
                    { marginBottom: 0 },
                    activeTab === tab1 && TabStyle.activeTab
                ]}>
                    { tab1 }
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabSwitch(tab2)}>
                <Text style={[
                    TextStyles.h2,
                    TabStyle.tab,
                    TextStyles.uppercase,
                    { marginBottom: 0 },
                    activeTab === tab2 && TabStyle.activeTab
                ]}>
                    { tab2 }
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const TabStyle = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: {
        fontWeight: 'normal',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeTab: {
        color: '#000',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        fontWeight: 'bold',
    },
})