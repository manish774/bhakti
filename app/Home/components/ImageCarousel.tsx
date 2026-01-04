import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const numColumns = isWeb && screenWidth > 768 ? 2 : 1;

export default function ImageCarousel({
  images,
  baseURL,
  style,
}: {
  images: string[];
  baseURL: string;
  style?: any;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const cardWidth = numColumns > 1 ? 400 : screenWidth - 40;

  useEffect(() => {
    if (images.length <= 1) return;

    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * cardWidth,
        animated: true,
      });
      return nextIndex;
    });
  }, [images.length, cardWidth]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={style}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        snapToAlignment="center"
      >
        {images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: `${baseURL}uploads/images/${img}` }}
            style={{
              width: cardWidth,
              height: 240,
            }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 12,
            alignSelf: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          {images.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: currentIndex === idx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  currentIndex === idx ? "#ffffff" : "rgba(255,255,255,0.4)",
                marginHorizontal: 3,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
