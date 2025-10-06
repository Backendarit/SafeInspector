import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    //Home.js-styles
    homeContainer: {
        flex: 1,
        backgroundColor: '#D2D5D7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#000',
    },
    homeButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 15,
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 18,
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
        backgroundColor: "#f9f9f9" 
    },
    siteTitle: { 
        fontSize: 22, 
        fontWeight: "bold", 
        marginBottom: 5 
    },
    siteSubtitle: { 
        fontSize: 16, 
        marginBottom: 10 
    },
    siteSectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 8,
    },
    siteCard: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    siteExtinguisherName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    siteAddButton: {
        backgroundColor: "green",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    siteAddButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },

    //ClientList.js-styles
    clientContainer: {
        flex: 1,
        backgroundColor: "#D2D5D7",
        padding: 15,
    },
    clientSearch: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    clientAddButton: {
        alignSelf: "flex-end",
        marginBottom: 10,
    },
    clientCard: {
        backgroundColor: "#fff",
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 2,
    },
    clientName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    clientSiteCount: {
        fontSize: 14,
        color: "#444",
    },
    clientSitesContainer: {
        marginTop: 8,
        paddingLeft: 10,
    },
    clientSiteCard: {
        backgroundColor: "#e9f5ff",
        padding: 8,
        marginVertical: 4,
        borderRadius: 6,
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    saveButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    saveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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

    //EditExtinguisher.js-styles
    editExtContainer: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: "#f9f9f9" 
    },
    editExtTitle: { 
        fontSize: 20, 
        fontWeight: "bold", 
        marginBottom: 20 
    },
    editExtLabel: { marginBottom: 5 },
    editExtInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    editExtButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    editExtDeleteButton: {
        backgroundColor: "red",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    editExtButtonText: { 
        color: "#fff", 
        fontWeight: "bold" 
    },
});

export default styles;