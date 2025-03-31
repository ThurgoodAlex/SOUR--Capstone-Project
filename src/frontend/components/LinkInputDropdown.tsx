import { TouchableOpacity, View, Text } from 'react-native';
import { PostPreview } from '@/components/PostPreview';
import { LinkPreview } from '@/components/LinkPreview';
import { Styles, TextStyles } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';
import { Post } from '@/constants/Types';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinkedItemsSelection } from '@/components/LinkItemsSelection';



export function LinkInputDropdown({ posts, selected, setter, columns, isListing }: {posts: Post[], selected: Post[], setter: React.Dispatch<React.SetStateAction<Post[]>>, columns: number, isListing: boolean}) {
      const [isOpen, setIsOpen] = useState(false);
       
      
      return (
      <View>
        {isListing ? <Text style={[TextStyles.h3, {textAlign:'left'}]}>Link Posts</Text>
        : <Text style={[TextStyles.h3, {textAlign:'left'}]}>Link Listings</Text>}

          <TouchableOpacity
          style={[TextStyles.h3,  
              {
                  backgroundColor: Colors.light60,
                  height: 45,
                  borderColor: Colors.dark,
                  borderWidth:1,
                  borderRadius: 8,
                  paddingRight: 30, // Make space for the icon
                  justifyContent: 'center'
              }
          ]}
          onPress={() => setIsOpen((value) => !value)}
          activeOpacity={0.8}>
          <Ionicons
                  name={isOpen? 'chevron-forward':'chevron-down-outline'}
                  size={24}
                  color={Colors.dark}
                  style={{
                      position: 'absolute',
                      right: 10,
                      top: 15,
                      transform: [{ translateY: -12 }], // Adjusts it to center vertically
                      pointerEvents: 'none' // Prevents blocking touch events
                  }}
              />
  
          
          <Text 
              style={[TextStyles.p, 
                      { color: 'gray', 
                      textAlign: 'left', 
                      marginTop: 4, 
                      paddingLeft:12}
                      ]}>
              {selected.length} selected
          </Text>
          </TouchableOpacity>
          {isOpen && <LinkedItemsSelection posts={posts} previouslySelected={selected} columns={columns} setter={setter}/>}
      </View>
      );
  
  }