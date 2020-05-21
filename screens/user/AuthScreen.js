import React,{useState,useEffect,useReducer,useCallback} from 'react';
import {ScrollView,View,KeyboardAvoidingView,Text,Button,ActivityIndicator,Alert,StyleSheet} from 'react-native';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

import {useDispatch} from 'react-redux';
import * as AuthActions from '../../store/actions/auth';
import { catchError } from 'rxjs/operators';

/////////////////////////////////////////////////////////////////////////////
//create formReducer outside to avoid re-render and useCallback because we
// do not depend on props
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
      const updatedvalues = {
          ...state.inputValues, // anciennes valeurs des inputs
          [action.input]: action.value // repercusion automatique sur le champ ciblé
      };
      const updatedValidities = {
          ...state.inputValidities,
          [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
          updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
          formIsValid: updatedFormIsValid,
          inputValues: updatedvalues, // mis à jour des champs
          inputValidities: updatedValidities
      }
  }
  return state;
};

//----------------------------------------AuthScreen

const AuthScreen=props=> {
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError] = useState(false);
  const [isSignup,setIsSignup]=useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
      inputValues: {
         email:'',
         password:''
      },
      inputValidities: {
          email:false,
          password:false,
      },
      formIsValid: false,

  })
//--------------------------------------------------

 useEffect(()=>{
    if(error){
      Alert.alert("Erreur",error, [{text:"Ok"}])
    }
 },[error,])
//---------------------------------------------------

  const authHandler = async () =>{
    let action;
     if(isSignup){
       action = AuthActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
     }else{
      action = AuthActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      )
     }
     setError(null);
     setIsLoading(true);
     try{
           await dispatch(action);
           props.navigation.navigate('Shop');
     }catch(err){
            setError(err.message);
            setIsLoading(false);
     }
 
     
  };

//-------------------------------------------------

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
    })
}, [dispatchFormState]);

//---------------------------------------------------

  return (
    <KeyboardAvoidingView
    behavior="padding"
    keyboardVerticalOffset={50}
    style={styles.screen}
    >
    <LinearGradient 
    colors={['#ffedff','#ffe3ff']}
    style={styles.gradient}
    >
        <Card style={styles.authContainer}>
          <ScrollView>
              <Input 
              id="email" 
              label="E-Mail" 
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Veuillez entrer une addresse email valide"
              onInputChange={inputChangeHandler}
              initialValue=""
              />

              <Input 
              id="password" 
              label="Mot de Passe" 
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Veuillez entrer un mot de passe valide"
              onInputChange={inputChangeHandler}
              initialValue=""
              />

              <View style={styles.buttonContainer}>
              {
                isLoading ? <ActivityIndicator size="small" color={Colors.primary}/> : 
                <Button title={isSignup ? "Créer un compte" : "Se Connecter"} color={Colors.primary} onPress={authHandler}/>
              }
                </View>

              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Ou</Text></View>

              <View style={styles.buttonContainer}>
              <Button title={`${isSignup ? 'Se connecter' : 'Créer un compte'}`}
               color={Colors.accent} 
              onPress={()=>{

                setIsSignup(prevState=>!prevState)
              
              }}
              />
              </View>

          </ScrollView>
      </Card>
      </LinearGradient>
    </KeyboardAvoidingView>

  )
};


//-----------------------------------------

AuthScreen.navigationOptions = {
  headerTitle:'Connexion'
}

//----------------------------------------


const styles = StyleSheet.create({
screen:{
  flex:1,
  justifyContent:'center',
  alignItems:'center'
},
gradient:{
width:'100%',
height:'100%',
justifyContent:'center',
alignItems:'center'
},
authContainer:{
  width:'80%',
  maxWidth:400,
  maxHeight:400,
  padding:20,
},
buttonContainer:{
  marginTop:10
}
});

export default AuthScreen
