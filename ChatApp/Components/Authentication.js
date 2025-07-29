import React,{useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialIcons'
import image1 from '../assets/image1.jpg'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.jpg'
import image4 from '../assets/image4.jpg'

export default function Authentication({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginView, setLoginView] = useState(true);
  const [signView, setSignView] = useState(false);

  return (
    <LinearGradient 
      colors={['#0F2027', '#2C5364']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {loginView ? (
<View style={{height:'60%', width:'90%', backgroundColor:'rgba(255,255,255,0.3)', borderRadius: 15}}>
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text style={{marginTop:20, fontSize: 30, color:'white'}}>Welcome Back</Text>
          <Text style={{marginTop: 10,fontSize:15, color:'white'}}> Login to your Account</Text>
          </View>
          <View style={{}}>
          <Icons name="mail" size={35} color="white" style={{top:70,left:10}}/>
          <Text style={{color:'white',top:40, left:60, fontSize:17}}>Enter Email</Text>
          <TextInput 
          style={{color:'white',marginTop: 10,marginLeft: '12%',fontSize:17, width: '80%',borderBottomColor:'white', borderBottomWidth:1}}
          value={email}
          onChangeText={setEmail}
          />
          </View>
          <View>
          <Icons name="lock-outline" size={35} color="white" style={{top:70, left:10}}/>
          <Text style={{color:'white',top:40, left:60, fontSize:17}}>Enter Password</Text>
          <TextInput 
          style={{color:'white',marginTop: 10,marginLeft: '12%',width: '80%',fontSize: 17,borderBottomColor:'white', borderBottomWidth:1}}
          value={password}
          onChangeText={setPassword}
          />
          </View>
        <TouchableOpacity onPress={()=>navigation.navigate('Tab')} style={{marginTop: 60,marginLeft: 75,width:'60%',height:'10%', borderColor:'white', borderWidth:1, borderRadius: 15}}>
          <Text style={{fontSize:20, color:'white',paddingHorizontal:80, paddingVertical:10}}>Log In</Text>
        </TouchableOpacity>
        <Text style={{color:'white',marginTop:30, marginLeft:40, fontSize:15}}>Don't have an Account?<Text onPress={()=>{
            setLoginView(false)
            setSignView(true)
        }}>  Sign Up</Text></Text>
        
      </View>
      )
    :
    <View style={{height:'70%', width:'90%', backgroundColor:'rgba(255,255,255,0.3)', borderRadius: 15}}>
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text style={{marginTop:20, fontSize: 30, color:'white'}}>Welcome New User</Text>
          <Text style={{marginTop: 10,fontSize:15, color:'white'}}>Create New Account</Text>
          </View>
           <View>
          <Icons name="person" size={35} color="white" style={{top:70,left:10}}/>
          <Text style={{color:'white',top:40, left:60, fontSize:17}}>Enter Username</Text>
          <TextInput 
          style={{color:'white',marginTop: 10,marginLeft: '12%',fontSize:17, width: '80%',borderBottomColor:'white', borderBottomWidth:1}}
          value={email}
          onChangeText={setEmail}
          />
          </View>
          <View>
          <Icons name="mail" size={35} color="white" style={{top:70,left:10}}/>
          <Text style={{color:'white',top:40, left:60, fontSize:17}}>Enter Email</Text>
          <TextInput 
          style={{color:'white',marginTop: 10,marginLeft: '12%',fontSize:17, width: '80%',borderBottomColor:'white', borderBottomWidth:1}}
          value={email}
          onChangeText={setEmail}
          />
          </View>
          <View>
          <Icons name="lock-outline" size={35} color="white" style={{top:70, left:10}}/>
          <Text style={{color:'white',top:40, left:60, fontSize:17}}>Enter Password</Text>
          <TextInput 
          style={{color:'white',marginTop: 10,marginLeft: '12%',width: '80%',fontSize: 17,borderBottomColor:'white', borderBottomWidth:1}}
          value={password}
          onChangeText={setPassword}
          />
          </View>
        <TouchableOpacity  onPress={()=>navigation.navigate('Tab')} style={{marginTop: 60,marginLeft: 75,width:'63%',height:'8%', borderColor:'white', borderWidth:1, borderRadius: 15}}>
          <Text style={{fontSize:20, color:'white',paddingHorizontal:80, paddingVertical:10}}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={{color:'white',marginTop:30, marginLeft:40, fontSize:15}}>Already Have An Account?<Text onPress={()=>{
            setSignView(false)
            setLoginView(true)
            }}>  Log In</Text></Text>
        
      </View>
    }
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    color: '#fff',
    fontSize: 18,
  }
});