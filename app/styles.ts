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
      paddingTop: Platform.OS === "ios" ? 60 : 40,
      paddingBottom: 32,
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
      paddingTop: 16,
      paddingBottom: 8,
    },
    searchBar: {
      backgroundColor: theme.card,
      borderRadius: 25,
      elevation: 4,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 2,
      borderColor: theme.cardBorder,
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
      borderWidth: 2,
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
      borderBottomWidth: 2,
      borderBottomColor: theme.cardBorder,
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
      right: 12,
    },
    dateChip: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: theme.accent,
      borderWidth: 2,
      elevation: 3,
    },
    dateChipText: {
      color: theme.accent,
      fontWeight: "700",
      fontSize: 12,
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
      padding: 16,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.cardBorder,
      alignItems: "center",
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    priceLabel: {
      fontSize: 13,
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
      borderColor: theme.accent,
      borderWidth: 1,
      elevation: 2,
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
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 64,
      paddingHorizontal: 32,
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
