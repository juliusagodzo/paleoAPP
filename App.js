import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator, Platform, InteractionManager, SafeAreaView } from 'react-native';
import {AntDesign} from "@expo/vector-icons"
import colors from "./colors";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import Fire from "./Fire"

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 50 * 1000;
if (Platform.OS === 'android') {
    // Work around issue `Setting a timer for long time`
    // see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (typeof id === 'string' && id.startsWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  }

  componentDidMount() {
    firebase = new Fire((error, user) => {
      if (error) {
        return alert("qualcosa è andato storto")
      }

      firebase.getLists(lists => {
        this.setState({lists, user}, () => {
          this.setState({loading: false})
        })
      })

      this.setState({user})
    });
  }

  componentWillUnmount() {
    firebase.detach();
  }

  toggleAddTodoModal() {
    this.setState({addTodoVisible: !this.state.addTodoVisible})
  }

  renderList = list => {
    return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList}/>
  }
        //funzione che AGGIUNGE NUOVO OGGETTO ALLA LISTA
  addList = list => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    }) 
  };

  deleteList = list => {
    firebase.deleteList(list);
  };

  updateList = list => {
    firebase.updateList(list)
  }

  render() {
    if (this.state.loading){
      return (
        <View style = {styles.container}>
          <Text style={[styles.title, {marginBottom: 20}]}>
              Paleo
              <Text style={{fontWeight: "300", color: colors.esperiaRed}}> A</Text>
              <Text style={{fontWeight: "300", color: colors.esperiaYellow}}>P</Text>
              <Text style={{fontWeight: "300", color: colors.esperiaGreen}}>P</Text>
          </Text>
          <ActivityIndicator size="large" color = {colors.blue}/>
        </View>
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
          <Modal 
            animationType="slide" 
            visible={this.state.addTodoVisible} 
            onRequestClose={() => this.toggleAddTodoModal()}
            hardwareAccelerated = {true}
            statusBarTranslucent = {true}
          >
            <AddListModal closeModal={()=> this.toggleAddTodoModal()} addList={this.addList}/>
          </Modal>
          <View style={{flexDirection: "row", justifyContent: "space-between", paddingBottom: 20, paddingTop: Platform.OS === "android" ? 50 : 0}}>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.title}>
                  Paleo
                  <Text style={{fontWeight: "300", color: colors.esperiaRed}}> A</Text>
                  <Text style={{fontWeight: "300", color: colors.esperiaYellow}}>P</Text>
                  <Text style={{fontWeight: "300", color: colors.esperiaGreen}}>P</Text>
                </Text>
            </View>

            <View style={{}}>
              <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
                <AntDesign name="plus" size={30} color={colors.white}/>
              </TouchableOpacity>
              <Text style={styles.add}>Aggiungi</Text>
            </View>
          </View>
        
          <View style={{height: Platform.OS === "android" ? 550 : 600, paddingLeft: 0}}>
            <FlatList 
              data={this.state.lists}
              keyExtractor={item => item.id.toString()} 
              horizontal={false} 
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => this.renderList(item)}
              keyboardShouldPersistTaps = "always"
            />
          </View>
          <View style={{bottom: Platform.OS == "ios" ? 25 : 0, position: "absolute"}}>
            <Text style={{opacity: 0.3}}>Julius Agodzo 2020 © | MIT License</Text>
          </View>
      </SafeAreaView>        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },


  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.blue,
    alignSelf: "center",
    paddingHorizontal: 40
  },
  addList: {
    borderWidth: 4,
    borderColor: colors.green,
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },
  add: {
    color: colors.green,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});
