import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
//  --BASICS--
    backgroundContainer: {
        flex: 1,
        backgroundColor: "#F0F3F5",
        padding: 15,
    },
    card: {
        backgroundColor: "#fff",
        padding: 14,
        marginVertical: 6,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 2,
    },

//  --TEXTS--
    clientName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
        flex: 1,
        flexWrap: "wrap",
        marginRight: 10,
    },
    saveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

//  --BUTTONS-- 
    editButton: {
        backgroundColor: "#3F8ECE",
        padding: 8,
        borderRadius: 6,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    addButton: {
        alignSelf: "flex-end",
        margin: 10,
    },
    saveButton: {
        backgroundColor: "#176817",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
        paddingHorizontal: 14,
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: "#F45A5A",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 10,
    },


    //WorkQueue.js-styles
    statusLateButton: {
        backgroundColor: "#F45A5A",
    },
    inspectionButton: {
        backgroundColor: "#ffffffff",
        borderWidth: 2,
        borderColor: "black",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginRight: 10,
        alignItems: "center",
    },
    inspectionButtonText: {
        color: "black",
        fontWeight: "bold",
    },
    activeInspButton: {
        backgroundColor: "black",
    },
    activeInsButtonText: {
        color: "white",
    },

    //Home.js-styles
    homeContainer: {
        flex: 1,
        backgroundColor: '#D2D5D7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    homeSummaryCard: {
        backgroundColor: '#fff',
        width: '85%',
        alignSelf: 'center',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 25,
        elevation: 3,
    },
    homeSummaryTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
        textAlign: 'center',
    },
    homeSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start', 
        alignItems: 'center',
        marginVertical: 6,
        paddingHorizontal: 20,        
     },

    homeSummaryIconGreen: {
        color: '#176817',
        fontSize: 20,
        marginRight: 10,
    },
    homeSummaryIconRed: {
        color: '#c62828',
        fontSize: 20,
        marginRight: 10,
    },
    homeSummaryLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    homeSummaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    homeWorkButton: {
        backgroundColor: '#176817',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 20,
        alignItems: 'center',
    },
    homeWorkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    //ProfileScreen.js-styles
    profileContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileSubtext: {
        marginTop: 10,
        fontSize: 16,
        color: '#444',
    },

    //SiteDetail.js
    siteContainer: { 
        flex: 1, 
        padding: 15, 
        backgroundColor: "#F0F3F5" 
    },
    siteHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    siteTitle: { 
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 5 
    },
    siteExtHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginLeft: 12,
    },
    siteCard: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    siteExtinguisherName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    textDetails: {
        fontSize: 16,
        marginVertical: 3,
    },
    siteButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    siteSmallButton: {
        backgroundColor: "#176817",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginRight: 10,
        alignItems: "center",
    },
    siteButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    statusBubble: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    extinguisherStatus: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 8,
    },


    //ClientList.js-styles

    clientSiteCount: {
        fontSize: 14,
        color: "#444",
    },
    clientSiteCard: {
        backgroundColor: "#e9f5ff",
        padding: 10,
        marginVertical: 4,
        borderRadius: 8,
    },
    clientSiteName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    clientSiteInfo: {
        fontSize: 13,
        color: "#333",
    },

    //AddClient.js-styles

    label: {
        fontSize: 14,
        marginVertical: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        fontSize: 16,
        marginBottom:8,
    },

    //WorkQueue.js-styles
    workContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    workText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    workSubtext: {
        marginTop: 10,
        fontSize: 16,
        color: '#444',
    },

    //AddExtinguisher.js-styles
    addExtContainer: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: "#f9f9f9" 
    },
    addExtTitle: { 
        fontSize: 20, 
        fontWeight: "bold", 
        marginBottom: 20 
    },
    addExtInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    addExtButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    addExtButtonText: { 
        color: "#fff", 
        fontSize: 16, 
        fontWeight: "bold" 
    },
    addExtlabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },

    // Map styles
    mapContainer: { flex: 1 },
    mapAbsoluteFill: StyleSheet.absoluteFillObject,

    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    markerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#ffffff",
    },
    });

export default styles;