import { Dimensions, Platform, StyleSheet } from "react-native";

export const createStyles = (theme: any) => {
  const { width: screenWidth } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";
  const numColumns = isWeb && screenWidth > 768 ? 2 : 1;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // Header Styles
    header: {
      marginBottom: 16,
    },
    headerGradient: {
      paddingTop: 35,
      paddingBottom: 16,
      paddingHorizontal: 24,
      alignItems: "center",
    },
    headerTitle: {
      color: theme.text,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 8,
      textShadowColor: "rgba(0,0,0,0.1)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    headerSubtitle: {
      color: theme.text,
      fontSize: 16,
      textAlign: "center",
      fontWeight: "500",
      opacity: 0.8,
    },

    // Search
    searchContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 0,
    },
    searchBar: {
      backgroundColor: theme.card,
      borderRadius: 25,
      elevation: 6,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      // remove hard border to favor a soft neumorphic shadow
      ...(isWeb && {
        boxShadow:
          "0 10px 20px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.02)",
      }),
    },
    searchInput: {
      fontSize: 16,
      color: theme.text,
    },

    // List Styles
    listContainer: {
      paddingHorizontal: isWeb ? 16 : 12,
      paddingBottom: 100,
      ...(isWeb && {
        paddingHorizontal: 24,
        maxWidth: 1200,
        alignSelf: "center",
        width: "100%",
      }),
    },
    row: {
      justifyContent: "space-around",
      paddingHorizontal: 8,
    },

    // Card Styles
    cardContainer: {
      flex: numColumns > 1 ? 0.48 : 1,
      marginVertical: 8,
      marginHorizontal: numColumns > 1 ? 8 : 4,
      ...(isWeb &&
        numColumns > 1 && {
          flex: 0.48,
          marginVertical: 12,
          marginHorizontal: 12,
        }),
    },
    card: {
      borderRadius: 20,
      elevation: 6,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      backgroundColor: theme.card,
      overflow: "hidden",
      // borderWidth: 2,
      borderColor: theme.cardBorder,
      ...(isWeb && {
        borderRadius: 24,
        maxWidth: 380,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
      }),
    },
    webCard: {
      maxWidth: isWeb ? 380 : undefined,
    },

    // Image Section
    imageSection: {
      position: "relative",
      height: 200,
    },
    cardImage: {
      width: "100%",
      height: "100%",
    },
    placeholderImage: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      // replace thin bottom border with a soft shadow to separate image area
      elevation: 2,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      ...(isWeb && {
        boxShadow: "inset 0 -6px 12px rgba(0,0,0,0.04)",
      }),
    },
    placeholderText: {
      fontSize: 48,
      opacity: 0.3,
    },
    imageOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
    },
    imageContent: {
      position: "absolute",
      top: 12,
      right: 5,
    },
    dateChip: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      // subtle raised look instead of a 1px border
      elevation: 2,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      ...(isWeb && {
        boxShadow: `0 4px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.02)`,
      }),
    },
    dateChipText: {
      color: theme.accent,
      fontWeight: "700",
      fontSize: 8,
    },

    // Content Section
    cardContent: {
      padding: 20,
      ...(isWeb && {
        padding: 24,
      }),
      backgroundColor: theme.card,
    },
    titleSection: {
      marginBottom: 16,
    },
    cardTitle: {
      fontWeight: "800",
      color: theme.text,
      lineHeight: 28,
      marginBottom: 8,
    },
    templeInfo: {
      gap: 6,
    },
    templeName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    locationIcon: {
      fontSize: 14,
    },
    location: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "500",
      opacity: 0.8,
    },

    // Price Section - MAJOR IMPROVEMENT
    priceSection: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 8,
      marginBottom: 8,
      // replaced the hard border with a soft, elevated shadow for neumorphism
      alignItems: "center",
      elevation: 6,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      ...(isWeb && {
        boxShadow:
          "6px 6px 20px rgba(0,0,0,0.06), -6px -6px 20px rgba(255,255,255,0.02)",
      }),
    },
    priceLabel: {
      fontSize: 10,
      color: theme.text,
      fontWeight: "600",
      marginBottom: 4,
      opacity: 0.8,
    },
    priceValue: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 8,
    },
    prasadChip: {
      backgroundColor: theme.button,
      // soft shadow instead of a 1px border
      elevation: 4,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      ...(isWeb && {
        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
      }),
    },
    prasadChipText: {
      color: theme.buttonText,
      fontWeight: "600",
      fontSize: 11,
    },

    // Swipe Section
    swipeSection: {
      alignItems: "center",
      marginTop: 8,
      ...(isWeb && {
        marginTop: 12,
      }),
    },

    // Loading Footer
    loadingFooter: {
      paddingVertical: 32,
      alignItems: "center",
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "600",
    },

    // Empty State
    // When FlatList is empty we want the content to center in the
    // scrollable area. use flexGrow so the content container can expand
    // and vertically center the empty state. Add bottom padding so the
    // message remains visible above the FAB.
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingBottom: 120,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 24,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
      opacity: 0.3,
    },
    emptyTitle: {
      color: theme.text,
      fontWeight: "700",
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      color: theme.text,
      textAlign: "center",
      fontSize: 16,
      lineHeight: 24,
      opacity: 0.8,
    },

    // FAB - IMPROVED
    fab: {
      position: "absolute",
      margin: 20,
      right: 0,
      bottom: 0,
      backgroundColor: theme.button,
      borderRadius: 28,
      elevation: 8,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });
};
