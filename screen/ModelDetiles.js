import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image,TouchableOpacity, TextInput, ScrollView,StatusBar, Alert,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from '../component/Header';
import { openDatabase } from 'react-native-sqlite-storage';


const db = openDatabase(
  {
  name: 'Main.db',
  location: 'default',
 },
()=>{},  
error => {console.warn(error)}
);


const RSimage = props => (
  
  <View
    style={styles.imageback}>
    <Image
      source={{uri: props.image}}
      resizeMode="contain"
      style={{
        width: 150,
        height: 150,
        borderRadius: 25,
      }}
    />
  </View>
);

function Info(props) {

  const {name, type, cost, dscription, category , ID} = props;
   
  // console.warn(props);

  const [show, setShow] = useState(false); //ShowMore ?
  return (
    <View style={{marginHorizontal: 18}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.texttitle}>Model</Text>
        <Text style={styles.textinfo}>{props.name}</Text>
      </View>
      <View style={styles.infoview}>
        <Text style={styles.texttitle}>Model type</Text>
        <Text style={styles.textinfo}>{props.type}</Text>
      </View>
      <View style={styles.infoview}>
        <Text style={styles.texttitle}>Cost</Text>
        <Text style={styles.textinfo}>{props.cost}</Text>
      </View>
      <View style={styles.infoview}>
        <Text style={styles.texttitle}>dscription</Text>
        <Text style={styles.textinfo}>{props.dscription}</Text>
      </View>
      <View style={styles.infoview}>
        <Text style={styles.texttitle}>Category</Text>
        <Text style={styles.textinfo}>{props.category}</Text>
      </View>
    </View>
  );
}



const Notes = () => {
  const [note, setNote] = useState([]);
  const [text ,onChangeText] =useState('');
  const [loading , setLoading] = useState(true);



  useEffect (() => {
    createTable();
    getNoteHistory();
  } , []);




  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        + "Note "
        + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Note_date TEXT, Note_details TEXT );"
      );
  })
}

const InsertNote = async () => {
      
 
  if(text.length ==0 ){  Alert.alert('Please enter note'); }


    else{
      try{
        await db.transaction(async (tx) => {
          await tx.executeSql(
            'INSERT INTO Note ( Note_date , Note_details ) VALUES (?,?)',
             [new Date().toDateString(), text]
            // console.warn(text),
          );
          console.warn('Data inserted');
       });
      } catch (error) {
        console.warn(error);
      }
      
     }
};
const getNoteHistory = async () => {
  try {

      await db.transaction( async (tx) => {
        tx.executeSql(
            "SELECT Note_date, Note_details  FROM Note ",
              [],
              (tx, results) => {
                  var len = results.rows.length;
                  
                  if (len > 0) {
                      for (let i = 0; i < len; i++) {
                          let row = results.rows.item(i);
                          note.push(row);
                          
                      }
                     setLoading(true);
                     setNote(note);

                  }
                  console.warn(note);
              }
          )
      })
  } catch (error) {
      console.warn(error);
  }
}

 
 if(!loading) return <ActivityIndicator size="small" color="#0000ff" />

 else
 
  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={{height: 120}}>
        <View style={styles.title}>
          <Text style={styles.textinfo}>Notes</Text>
          <TouchableOpacity>
            <Icon name="arrow-up" size={20} color={'#dddd'} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewinputShadow}>
          <TextInput
            keyboardType="default"
            placeholder="Add to Note ..."
            maxLength={50}
            onChangeText={onChangeText}
            style={styles.inputNote}
          />

          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => InsertNote()}
            style={styles.Save}>
            <Icon name="save" size={18} color={'#2C272E'} />
            <Text style={{color: '#2C272E'}}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>

       
        <Text style={styles.title}>History Note</Text>

       
         <ScrollView>
          <View style={styles.historyCard}>
            {note.length > 0  && note.map(note => (
                <View style={{width: '90%', margin: 6}}>
                  <Text style={styles.textinfo}>User</Text>
                  <Text style={{fontSize: 12, fontStyle: 'italic'}}>{note.Note_date}</Text>
                  <Text>{note.Note_details}</Text>
                  <Text style={{color: '#F0ECE3'}}> ________________________________________________</Text>
                </View>
              ))}
          </View>
        </ScrollView>

      
      </View>
    </>
  )
  
 
  
}
 


const ModelDetiles = ({route,navigation}) => {
  const {name, type, image, cost, dscription, category ,ID} = route.params;
  return (
    <>
     <Header leftIcon='arrow-circle-left' rightIcon='edit'  nameScreen='Model' onPressLeft={()=>navigation.goBack()} />
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <RSimage image={image}></RSimage>
        </View>
        <View style={styles.title}>
          <Text style={styles.textinfo}>Image Info</Text>
          <TouchableOpacity>
            <Icon name="arrow-up" size={20} color={'#dddd'} />
          </TouchableOpacity>
        </View>
        <View style={{marginVertical: 10, width: '100%'}}>
          <Info
            ID={ID}
            name={name}
            type={type}
            cost={cost}
            dscription={dscription}
            category={category}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        <Notes />
      </View>
    </>
  );
};
const styles = StyleSheet.create({

   imageback :{
    width: 250,
    height: 150,
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 2.22,
    elevation: 5,
   } ,
  infoview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  textinfo: {fontSize: 18, fontWeight: 'bold'},
  texttitle: {fontSize: 18, fontWeight: '400'},
  title: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    
  },
  historyCard:{
    backgroundColor: '#fff',
    width: '85%',
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius:20,
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.22,
    shadowRadius: 2.10,
    elevation: 3,
    marginVertical: 10,
    padding:10
  },
  inputNote:{
    marginLeft: 10,
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
    flex: 1,
  },
  Save:{
    justifyContent:'center',
    height: 40,
    width: 80,
    marginRight:5,
    backgroundColor:'#eee',
    borderRadius:70,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'space-evenly',
  },
  viewinputShadow:{
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 30,
    bottom:25,
    flexDirection: 'row',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
export default ModelDetiles;
