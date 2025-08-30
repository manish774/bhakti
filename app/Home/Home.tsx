import SwipeButton from "@/components/SwipeButton";
// import { useState } from "react";
import Model from "@/components/Model";
import { useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import SplashScreen from "../../components/SplashScreen";
import { vibrate } from "../../utils/Vibrate";
interface TempleInfo {
  name: string;
  location: string;
  image: ImageSourcePropType;
  pandit: {
    name: string;
  };
  price: number;
}

interface TempleList {
  title: string;
  temple: TempleInfo;
}
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  // Ref for SwipeButton to control swipe programmatically

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  // Sample images from assets/images
  const images: ImageSourcePropType[] = [
    require("../../assets/images/Initial/1.jpg"),
    require("../../assets/images/adaptive-icon.png"),
    require("../../assets/images/icon.png"),
    require("../../assets/images/react-logo.png"),
    require("../../assets/images/splash-icon.png"),
  ];

  // Generate 100 sample temples
  const allData: TempleList[] = Array.from({ length: 100 }, (_, i) => ({
    title: `Temple #${i + 1}`,
    temple: {
      name: `Temple Name ${i + 1}`,
      location: `Location ${(i % 10) + 1}`,
      image: images[i % images.length],
      price: 200,
      pandit: {
        name: `Pandit ${i + 1}`,
      },
    },
  }));

  const [visibleCount, setVisibleCount] = useState(10);
  const [data, setData] = useState<TempleList[]>(
    allData.slice(0, visibleCount)
  );

  const loadMore = () => {
    if (visibleCount < allData.length) {
      vibrate();
      const newCount = Math.min(visibleCount + 10, allData.length);
      setData(allData.slice(0, newCount));
      setVisibleCount(newCount);
    }
  };

  const renderItem = ({ item, index }: { item: TempleList; index: number }) => (
    <Card style={styles.card}>
      <Card.Cover source={item.temple.image} style={styles.image} />
      <Card.Title title={item.title} titleStyle={styles.title} />
      <Card.Content>
        <Text style={styles.templeName}>{item.temple.name}</Text>
        <Text style={styles.location}>{item.temple.location}</Text>
        <SwipeButton
          label={`book now @ ${item.temple.price}`}
          onToggle={() => {
            setSelectedIndex(index);
            setModalVisible(true);
            vibrate();
          }}
        />
      </Card.Content>
    </Card>
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />

      <Model
        isVisible={modalVisible}
        title={data[selectedIndex].title}
        coverSource={data[selectedIndex].temple.image}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        content={
          <>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {data[selectedIndex].temple.name}
            </Text>
            <Text>Pandit: {data[selectedIndex].temple.pandit.name}</Text>
            <Text>Location: {data[selectedIndex].temple.location}</Text>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  templeName: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  cardSliderContainer: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 8,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#6200ee",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 20,
  },
});
