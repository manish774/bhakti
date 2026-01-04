import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { renderItem } from "@/utils/render-item";

const defaultDataWith6Colors: string[] = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

const Carousels: FC = () => {
  const progress: SharedValue<number> = useSharedValue(0);

  return (
    <View
      id="carousel-component"
      dataSet={{ kind: "basic-layouts", name: "parallax" }}
      style={styles.container}
    >
      <Carousel<string>
        autoPlayInterval={2000}
        data={defaultDataWith6Colors}
        loop
        pagingEnabled
        snapEnabled
        width={100}
        height={258}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={(
          _offsetProgress: number,
          absoluteProgress: number
        ) => {
          progress.value = absoluteProgress;
        }}
        renderItem={renderItem({ rounded: true })}
      />
    </View>
  );
};

export default Carousels;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
