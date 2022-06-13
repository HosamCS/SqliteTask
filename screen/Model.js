import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import { Header } from '../component/Header';
import Searchbar from '../component/Searchbar';


// Creating a new database


//Creating a function named CreateTable to create a table in the database
// const CreateTable = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       "CREATE TABLE IF NOT EXISTS items" 
//       +"Model"
//       +"(Id INTERGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255)"
//       + " type VARCAHR(255) cost INTERGER, category VARCHAR(255),description VARCHAR(500)  image VARCHAR(255));",
//     ) 

//   }).then(() => {
//     console.log('Table items created');
    
//   }).catch(error => { 
//     console.log(error);
//   });
// }

const Card = props => {
  return (
    <>
    <View
      style={styles.viewCardIamge}>
      <Image
        source={{uri: props.image,}}
        style={{width: 120, height: 120,}}
        resizeMode='contain'
      />
    </View>
     <View style={{alignItems: 'center',bottom:8}}>
     <Text style={{fontSize: 16, fontWeight: '600'}}>{props.name}</Text>
   </View>
   </>
  );
};

const db = openDatabase(
  {
  name: 'Main.db',
  location: 'default',
 },
()=>{},  
error => {console.warn(error)}
);

export default function Model({navigation}) {

    const  [modals , setModal] = useState([]);

    const [loading , setLoading] = useState(false);

    useEffect(() => {
      getData();
  
    }, []);

    const getData = async () => {
      try {

         await db.transaction((tx) => {
            tx.executeSql(
                "SELECT ID, name, cost , type , dscription , category , image FROM Model",
                  [],
                  (tx, results) => {
                      var len = results.rows.length;
                      if (len > 0) {
                          for (let i = 0; i < len; i++) {
                              let row = results.rows.item(i);
                              modals.push(row);
                          }
                          setModal(modals);
                          setLoading(true);
                      }
                      console.warn(modals);
                  }
              )
          })
      } catch (error) {
          console.log(error);
      }
  }


  return (
    <>
    <Header leftIcon='arrow-circle-left' rightIcon='edit'  nameScreen='Model' onPressLeft={()=>navigation.goBack()} />
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{marginVertical:20}}>
          <Searchbar></Searchbar>
        </View>
       
        <ScrollView
          contentContainerStyle={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
  
          
           {modals.length > 0 && modals.map(model => (
             <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
               navigation.navigate('ModelDetiles', {
                 ID:model.ID,
                 name: model.name,
                 type: model.type,
                 image: model.image,
                 cost: model.cost,
                 dscription: model.dscription,
                 category: model.category,
               })
             }>
             <Card name={model.name} image={model.image} />
           </TouchableOpacity>
           ))}
        
        </ScrollView>
      </View>
    </>
  );

}             


const styles = StyleSheet.create({
  viewCardIamge:{
    width:170,
    marginVertical: 15,
    marginHorizontal:10,
    justifyContent:'center',alignItems:'center',backgroundColor:'#fff',borderRadius:25,
    shadowColor: "#000", shadowOffset:{ width: 0, height: 3,},shadowOpacity: 0.25, shadowRadius:2.22, elevation: 5
  },


});
