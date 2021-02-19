import firebase from "firebase"
import "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBfIrSLXm3mPohCbiuy1lKsJmhTnfsUfKM",
    authDomain: "paleoapp-bd7cf.firebaseapp.com",
    databaseURL: "https://paleoapp-bd7cf.firebaseio.com",
    projectId: "paleoapp-bd7cf",
    storageBucket: "paleoapp-bd7cf.appspot.com",
    messagingSenderId: "909076710447",
    appId: "1:909076710447:web:e72ce8ff8be86e66c1b2da",
    measurementId: "G-E4M85ZGQVF"
}
class Fire{
    constructor(callback){
        this.init(callback)
    }
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch(error => {
                        callback(error)
                    });
            }
        })
    }

    getLists(callback){
        let ref = this.ref.orderBy("name")

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []

            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data() });
            });

            callback(lists);
        })
    }

    addList(list) {
        let ref = this.ref;
        ref.add(list);
    }

    deleteList(list) {
        let ref = this.ref;
        ref.doc(list.id).delete()
    }

    updateList(list){
        let ref = this.ref
        ref.doc(list.id).update(list);
    }

    get userId() {
        return firebase.auth().currentUser.uid
    }

    get ref() {
        return firebase
        .firestore()
        .collection("users")
        .doc(this.userId)
        .collection("lists")
    }

    detach() {
        this.unsubscribe();
    }
}

export default Fire;