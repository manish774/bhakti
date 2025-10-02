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

export const loginStyles = (theme: any, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    gradient: {
      flex: 1,
    },
    floatingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    floatingElement: {
      position: "absolute",
      borderRadius: 50,
    },
    keyboardAvoidingView: {
      flex: 1,
      zIndex: 1,
    },
    scrollContainer: {
      justifyContent: "center",
      padding: 20,
      minHeight: height,
    },
    scrollContainerWithKeyboard: {
      justifyContent: "flex-start",
      paddingTop: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
      paddingTop: "30%",
    },
    logoGradient: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 15,
    },
    appName: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 8,
      letterSpacing: -0.5,
      textShadowColor: "rgba(0, 0, 0, 0.1)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
      textAlign: "center",
    },
    authCard: {
      borderRadius: 30,
      marginBottom: 20,
      marginHorizontal: 20,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.15,
      shadowRadius: 40,
      elevation: 25,
      overflow: "hidden",
    },
    cardGradient: {
      padding: 30,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    tabContainer: {
      flexDirection: "row",
      position: "relative",
      marginBottom: 30,
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 30,
      padding: 4,
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 2,
      borderColor: theme.accent,
    },
    tabIndicator: {
      position: "absolute",
      top: 4,
      bottom: 4,
      width: "48%",
      left: 4,
      borderRadius: 25,
      backgroundColor: theme.accent,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      zIndex: 1,
      flexDirection: "row",
    },
    tabIcon: {
      marginRight: 8,
    },
    tabText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      opacity: 0.6,
    },
    activeTabText: {
      color: "white",
      fontWeight: "700",
      opacity: 1,
    },
    formContainer: {
      paddingHorizontal: 0,
    },
    form: {
      marginBottom: 10,
    },
    inputContainer: {
      marginBottom: 20,
      borderRadius: 20,
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 5,
    },
    inputGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      minHeight: 60,
      borderWidth: 2,
      borderColor: "rgba(0,0,0,0.08)",
      borderRadius: 20,
      backgroundColor: "white",
    },
    inputFocused: {
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
      // Removed transform scale to prevent touch issues
    },
    inputIcon: {
      marginRight: 16,
      opacity: 0.8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
      paddingVertical: 10,
      paddingHorizontal: 0,
      minHeight: 45,
    },
    eyeIcon: {
      padding: 15,
      borderRadius: 20,
      marginLeft: 8,
      minWidth: 44,
      minHeight: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: -16,
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: "rgba(255, 107, 107, 0.1)",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: "rgba(255, 107, 107, 0.2)",
    },
    errorText: {
      color: "#FF6B6B",
      fontSize: 14,
      marginLeft: 8,
      fontWeight: "500",
      flex: 1,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 5,
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    forgotPasswordText: {
      color: theme.accent,
      fontSize: 15,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    primaryButton: {
      borderRadius: 25,
      overflow: "hidden",
      marginBottom: 16,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 25,
      elevation: 15,
    },
    buttonGradient: {
      paddingVertical: 18,
      paddingHorizontal: 30,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 60,
      flexDirection: "row",
    },
    buttonText: {
      color: "white",
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: 0.5,
      textShadowColor: "rgba(0,0,0,0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    buttonIcon: {
      marginLeft: 10,
    },
    bottomSpacer: {
      height: 100,
    },
    toastContainer: {
      position: "absolute",
      left: 20,
      right: 20,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 25,
      elevation: 15,
      zIndex: 99999,
    },
    toastGradient: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    toastText: {
      color: "white",
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
      marginLeft: 8,
      flex: 1,
    },
    disabledButton: {
      opacity: 0.6,
      elevation: 5,
      shadowOpacity: 0.2,
      transform: [{ scale: 0.98 }],
    },
  });
