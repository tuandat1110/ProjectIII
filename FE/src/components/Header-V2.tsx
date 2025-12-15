import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface IHeader {
    title: string | undefined;
    navigation: NavigationProp<any>;
}

const HeaderV2 = ({ title, navigation }: IHeader) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color={'#4e89c7ff'} />
            </TouchableOpacity>
            <Text style={styles.roomTitle}>{title}</Text>
            <TouchableOpacity>
                <Icon name="ellipsis-vertical" size={24} color={'#4e89c7ff'} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
     header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },

    roomTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4e89c7ff',
    },


})

export default HeaderV2;