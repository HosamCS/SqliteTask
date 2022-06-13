import React,{useState} from 'react';
import {View, Text, TextInput, FlatList,StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { openDatabase } from 'react-native-sqlite-storage';


const db = openDatabase(
  {
  name: 'Main.db',
  location: 'default',
 },
()=>{},  
error => {console.warn(error)}
);

export default function Searchbar() {

   const [inputModelName , onChangeText] = useState('');
   const [viewdate , setViewdate] = useState({});

   let searchModel =()=>{
    console.warn(inputModelName);
    setViewdate({});
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Model WHERE name LIKE ?",[`%${inputModelName}%`]
        [inputModelName],
        (tx, results) => {
          var len = results.rows.length;
          var data =[];
         for (let i = 0 ; i < len ; i++){
          data.push(results.rows.item(i));
        }
     });
    });
   }

  return (
    <View
      style={styles.contaniner}>
      <TextInput
        keyboardType="default"
        placeholder="Search Model Name"
        maxLength={30}
        style={styles.input} 
        onChangeText={(text)=>{searchModel(text)}}
        >

      </TextInput>

      <View  style={styles.Rbtn}>
        <AntDesign name="barcode" size={30} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  contaniner:{
    width: '85%',
    backgroundColor: '#eee',
    borderRadius: 20,
    marginTop: 5,
    flexDirection: 'row',
    alignSelf:'center',shadowColor: "#000", shadowOffset: { width: 0, height: 2, },shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5
  },
  Rbtn:{
    width: 80,
    height:40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    marginRight:8
  },
  input:{
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle:'italic',
    flex: 1,
  }


});

