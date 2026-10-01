import { StyleSheet, View, Text, Pressable } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons"

export default function ItemLoja({nomeProduto,onEditPress,onDeletePress}) {
    return (
        <View style={styles.container}>
            <Pressable onPress={onEditPress}>
                <MaterialIcons name="edit" color={"black"} size={24} />
            </Pressable>

            <Text style={styles.title}>{nomeProduto}</Text>

            <Pressable onPress={onDeletePress}>
                <MaterialIcons name="delete" color={"black"} size={24} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "lightgray",
        justifyContent:"space-between",
        alignItems:"center",
        padding:10,
        width:"90%",
        alignSelf:"center",
        borderRadius:10
    },
    title:{
        flex:1,
        marginLeft:10,
        fontSize:17,
        fontWeight:500
    }
})