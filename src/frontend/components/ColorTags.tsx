import { View, StyleSheet, Text } from 'react-native';
import { Colors, basicColors } from '@/constants/Colors';

export function ColorTags({ colors }: { colors: string[] }) {
    
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {colors.map((color) => {
                const colorData = basicColors.find(c => c.name === color);
                return colorData ? (
                    <View
                        key={color}
                        style={ColorTagStyles.tag}
                    >
                        <View style= {
                            {
                                backgroundColor: colorData.hex,
                                width: 16,
                                height: 16,
                                borderRadius: 10,
                                marginRight: 2,
                            }
                        }>
                            
                        </View>
                        <Text style={{ color: Colors.dark }}>{color}</Text>
                    </View>
                ) : null;
            })}
        </View>
    );
}

export const ColorTagStyles = StyleSheet.create({
    tag:{
        flexDirection: "row",
        gap:3,
        alignItems: "center",
        backgroundColor: Colors.light60,
        borderRadius: 8,
        padding: 5,
        margin: 2,
        color: Colors.dark
    },
});