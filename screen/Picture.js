import React, {useState ,useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from '../component/Header';
import { openDatabase } from 'react-native-sqlite-storage';

const {height, width} = Dimensions.get('screen');

const Tab = createBottomTabNavigator();


const db = openDatabase(
  {
    name: 'Main.db',
    location: 'default',
  }
, (error) => {console.warn(error)});


export default function Picture({props,navigation}){

  const [name , setName] = useState('');
  const [type , setType] = useState('');
  const [cost , setCost] = useState('');
  const [dscription , setDscription] = useState('');
  const [category , setCategory] = useState('');
  const [image , setImage] = useState('');

  useEffect(() => {
    createTable();
    getData();
}, []);


  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        + "Model "
        + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cost INTEGER,type TEXT ,dscription TEXT ,category TEXT,image TEXT);"
      );
  })
}


  const setData = async() => {
    if(name.length ==0  || type.length ==0 || cost.length ==0 || dscription.length==0 || category.length==0|| image.length==0){
      Alert.alert('warning', 'Missing item ?')
    }
    
    else {
      try{
          await db.transaction(async (tx) => {
            await tx.executeSql(
                "INSERT INTO Model (name, cost , type , dscription , category , image) VALUES (?,?,?,?,?,?)",
                [name, cost, type, dscription, category, image]
            );
            console.warn('Data inserted');
         

        });
        navigation.navigate('Model');

      }
      catch(error){
        console.warn(error);
      }
    }
  }

  const getData = () => {
    try {
        
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT ID , name, cost , type , dscription , category , image FROM Model",
                [],
                (tx, results) => {
                    var len = results.rows.length;
                    if (len > 0) {
                        navigation.navigate('Model');
                    }
                }
            )
        })
    } catch (error) {
        console.log(error);
    }
}


  return (
    <>
    <Header leftIcon='arrow-circle-left'  rightIcon='check-circle' nameScreen='Picture' />
   
    <View style={styles.container}>
   
      <View style={styles.btn}>
        <View style={{flexDirection: 'row', flex: 1,justifyContent: 'space-between',}}>
          <View style={styles.viewlableleft}>
            <Icon  name="home"size={25}color={'#191A19'}style={{paddingRight: 15}} />
            <Text style={styles.text}>Asset Inventory</Text>
          </View>
            <TouchableOpacity   style={styles.lebleleft} onPress={() => navigation.navigate('Model')}>
              <Icon name="arrow-right" size={20} color={'#4E9F3D'} />
            </TouchableOpacity>
          </View>
      </View>

      <View style={styles.btn}>
        <View
          style={{flexDirection: 'row',flex: 1,justifyContent: 'space-between',}}>
          <View style={styles.viewlableleft}>
            <Icon name="user"size={25} color={'#191A19'} style={{paddingRight: 15}}/>
            <Text style={styles.text}>Model</Text>
          </View>
            <TouchableOpacity  style={styles.lebleleft} onPress={() => navigation.navigate('Model')}>
              <Icon name="arrow-right" size={20} color={'#4E9F3D'} />
            </TouchableOpacity>
          </View>
      </View>


       <View style={styles.btn}>
        <View style={{flexDirection: 'row',flex: 1, justifyContent: 'space-between',}}>
           {/* LeftLebel */}
           <View style={styles.viewlableleft}>
             <Icon name="user" size={25}color={'#191A19'}style={{paddingRight: 15}}/>
             <Text style={styles.text}>Person</Text>
            </View>
             {/* arrowBtn */}
          <TouchableOpacity style={styles.lebleleft} onPress={() => navigation.navigate('Test')}>
            <Icon name="arrow-right" size={20} color={'#4E9F3D'} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{}}>
      <TextInput
                style={styles.input}
                placeholder='Enter your name'
                onChangeText={(value) => setName(value)}
            />
            <TextInput
                style={styles.input}
                placeholder='Enter your type'
                onChangeText={(value) => setType(value)}
            />
              <TextInput
                style={styles.input}
                placeholder='Enter your cost'
                onChangeText={(value) => setCost(value)}
            />
              <TextInput
                style={styles.input}
                placeholder='Enter your description'
                onChangeText={(value) => setDscription(value)}
            />
              <TextInput
                style={styles.input}
                placeholder='Enter your category'
                onChangeText={(value) => setCategory(value)}
            />
              <TextInput
                style={styles.input}
                placeholder='Enter your image link'
                onChangeText={(value) => setImage(value)}
            />

          <TouchableOpacity style={styles.btn} onPress={() => setData() }>
            <Text style={{textAlign:'center',fontSize: 20, color: '#555',}}>push Data to sqlite</Text>
          </TouchableOpacity>
     
      </ScrollView>        
    </View>
   
    </>
  );
}


const styles = StyleSheet.create({
    container:{
      flex:1,justifyContent: 'flex-start',alignItems: 'center',backgroundColor: '#eee',
    },
  btn: {
    width: '85%',
    height: 50,
    margin: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },
  text:{
    fontSize: 20, fontWeight: '600', color: '#000'
  },
  lebleleft:{
    justifyContent: 'center', marginRight: 15
  },
  viewlableleft:{
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
}
});
