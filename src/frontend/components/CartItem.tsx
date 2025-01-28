import { Post } from '@/constants/Types';
import { CartItemProps } from '@/constants/Types'
import { cartStyle } from '@/constants/Styles'
import { Text, Image, View } from 'react-native';

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
    return (
        <View style={cartStyle.container}>
          {item.coverImage && <Image source={item.coverImage} style={cartStyle.image} />}
          <View style={cartStyle.details}>
            <Text style={cartStyle.title}>{item.title}</Text>
            <Text style={cartStyle.brand}>{item.brand}</Text>
            <Text style={cartStyle.price}>${item.price}</Text>
          </View>
        </View>
      );
    };