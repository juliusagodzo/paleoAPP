import React from 'react'
import { Text, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput} from 'react-native'
import {AntDesign} from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar';
import colors from "../colors"

export default class AddListModal extends React.Component {
    backgroundColors = ["#5cd859", "#24a6d9", "#595bd9", "#8022d9", "#d159d8", "#d85963", "#d88559"];

    state = {
        name: "senza titolo",
        color: "#0a0a0a"
    };

    createTodo = () => {
        const {name, color} = this.state
        const list = {name, color }

        this.props.addList(list);

        this.setState({name: "senza titolo"});
        this.props.closeModal();
    }

    renderColors() {
        return this.backgroundColors.map(color => {
            return (
                <TouchableOpacity key={color} 
                    style={[styles.colorSelect, {backgroundColor: color}]}
                    onPress={() => this.setState({color})} 
                />
            )
        })
    }
    render() {
        return (
            <KeyboardAvoidingView style= {[styles.container, {backgroundColor: this.state.color}]} behavior="padding" >
                <StatusBar style="light" />
                <TouchableOpacity style={{position: "absolute", top: 64, right: 32, backgroundColor: colors.red, borderRadius: 6}} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={24} color={colors.white}/>
                </TouchableOpacity>
                <View style={{alignSelf: "stretch", marginHorizontal: 32}}>

                    <Text style= {styles.title}>crea lista</Text>

                    <TextInput style={styles.input} 
                        placeholder="nome argomento..." 
                        onChangeText={text => this.setState({name: text})}
                        color={colors.white}
                        placeholderTextColor={colors.white}
                    />

                    <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 12}}>{this.renderColors()}</View>

                    <TouchableOpacity style={styles.create} onPress={this.createTodo}>
                        <Text style={{color: colors.white, fontWeight: "600", fontSize: 20}}>Crea</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.black,
        alignSelf: "center",
        marginBottom: 16
    },
    input: {
        borderWidth: 2,
        borderColor: colors.black,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: colors.black
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.black
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4
    }
})
