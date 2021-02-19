import React from "react";
import {StyleSheet, Text, View, TouchableOpacity, Modal, Platform} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import TodoModal from "./TodoModal"
import colors from "../colors"

export default class TodoList extends React.Component{
    state = {
        showListVisible: false
    }

    toggleListModal(){
        this.setState({showListVisible: !this.state.showListVisible})
    }
    
    render () {
        const list = this.props.list
        const completedCount = list.todos.filter(todo => todo.completed).length;
        const remainingCount = list.todos.length - completedCount;

        return (
            <View>
                <Modal 
                    animationType="slide" 
                    visible={this.state.showListVisible} 
                    onRequestClose={() => this.toggleListModal()}
                    hardwareAccelerated = {true}
                    statusBarTranslucent = {true}
                >
                    <TodoModal 
                        list={list} 
                        closeModal={()=> this.toggleListModal()} 
                        updateList = {this.props.updateList}
                    />
                </Modal>

                    <TouchableOpacity 
                        style={[styles.listContainer, {backgroundColor: list.color}]} 
                        onPress={() => this.toggleListModal()}>

                        <Text style={styles.listTitle} numberOfLines={1}>
                            {list.name}
                        </Text>
            
                        <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.count}>{remainingCount}</Text>
                                <Text style={styles.subtitle}>rimanenti</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.count}>{completedCount}</Text>
                                <Text style={styles.subtitle}>completati</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{position: "absolute", right: 20, backgroundColor: colors.red, borderRadius: 6}} onPress={() => this.props.deleteList(list)}>
                            <AntDesign name="close" size={24} color={colors.white}/>
                    </TouchableOpacity>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        borderRadius: 6,
        marginHorizontal: 12,
        justifyContent: "space-between",
        width: 350,
        flexDirection: "column",
        marginVertical: 2
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18
    },
    count: {
        fontSize: 20,
        fontWeight: "200",
        color: colors.white
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.white,
        alignSelf: "center",
        marginLeft: 5
    },
})