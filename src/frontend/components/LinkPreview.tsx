import { Colors } from "@/constants/Colors";
import { Styles, TextStyles } from "@/constants/Styles";
import { Post } from "@/constants/Types";
import { useGetMedia } from "@/hooks/useGetMedia";
import { router } from "expo-router";
import { ImageBackground, TouchableOpacity, View, Text } from "react-native";

export function LinkPreview({ listing, touchable = true }: { listing: Post, touchable?: boolean }) {

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(parseFloat(listing.price));
    
    const { images, loading: mediaLoading, error: mediaError } = useGetMedia(Number(listing.id));
    
    
    let coverImage = images && images.length > 0 ? images[0].url : listing.coverImage
    if (mediaError) 
    {
        console.log('Error loading media:', mediaError)
        coverImage = require('../assets/images/placeholder.png')
    }


    return (
        <View key={listing.id} style={{ minHeight:85, maxHeight:120, opacity: listing.isSold ? 0.5 : 1, padding:5 }}> 
            <TouchableOpacity
                onPress={() => router.push(`/PostInfoScreen/${listing.id}`)}
                style={{ flex: 1, margin: 5, borderBottomColor: 'lightgrey', borderBottomWidth:.5 }}
                disabled={listing.isSold || !touchable} 
            >
                <View style={[Styles.row, {gap:6}]}>
                    <ImageBackground  
                        source={typeof coverImage === 'string' ? { uri: coverImage } : coverImage}
                        style={[ {height: 70}, {width: 70} ]} 
                    />

                    <View style={[Styles.row, { justifyContent: "space-between" }]}>
                    
                        <Text style={[TextStyles.h2, { textAlign: "left", width:'60%' }]}>{listing.title}</Text>
                        {!(listing.size && listing.size != "n/a")? <Text>{listing.size}</Text>: null}

                        <View style={[Styles.column, {alignItems: "flex-end"}]}>
                            <Text style={TextStyles.h3}>{formattedPrice}</Text>
                            {!(listing.isSold)? <Text style={[{color:Colors.green},  TextStyles.bold]}>Still Available</Text>: <Text style={[{color:Colors.grapefruit}, TextStyles.bold]}>Sold</Text>}
                        </View>
                    
                    </View>
                </View>
               
            </TouchableOpacity>
        </View>
    );
}