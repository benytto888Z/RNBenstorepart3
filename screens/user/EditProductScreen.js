import React,{useState,useEffect,useCallback} from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Platform} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';

import * as productsAction from '../../store/actions/products';

const EditProductScreen =props=>{
    const dispatch =useDispatch();
    const prodId=props.navigation.getParam('productId');
    const editedProduct = useSelector(state=>
        state.products.userProducts.find(prod=>prod.id===prodId)
    );

    const [title,setTitle]=useState(editedProduct ? editedProduct.title : '');
    const [imageUrl,setImageUrl]=useState(editedProduct ? editedProduct.imageUrl : '');
    const [price,setPrice]=useState(editedProduct ? editedProduct.price : '');
    const [description,setDescription]=useState(editedProduct ? editedProduct.description : '');


    // useCallback this ensure that this function is not recreated everytime the component re-renders
    // and therefore we avoid infinite loop
    const submitHandler =useCallback(()=>{
        if(editedProduct){
            dispatch(productsAction.updateProduct(
                prodId,
                title,
                description,
                imageUrl,
                ))
        }else{
            dispatch(productsAction.createProduct(
                title,
                description,
                imageUrl,
                +price // conversion en nombre sinon erreur
            ))
        }
        props.navigation.goBack();
    },[dispatch,prodId,title,description,imageUrl,price]);// we pass empty array to avoid re-rendres every time seconds

    useEffect(()=>{
        props.navigation.setParams({submit:submitHandler})
    },[submitHandler]);

    return(
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput style={styles.input} value={title} onChangeText={text=>setTitle(text)}/>
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Image</Text>
                    <TextInput style={styles.input} value={imageUrl} onChangeText={text=>setImageUrl(text)}/>
                </View>
                {/*ne pas afficher le prix quand on est en modif*/}
                {editedProduct ? null :
                <View style={styles.formControl}>
                    <Text style={styles.label}>Prix</Text>
                    <TextInput style={styles.input} value={price} onChangeText={text=>setPrice(text)}/>
                </View>
                }
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} value={description} onChangeText={text=>setDescription(text)}/>
                </View>
            </View>

        </ScrollView>

    )
}

EditProductScreen.navigationOptions=(navData)=> {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId')? 'Modification de produit' : 'Ajout de produit',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Valider' iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                  onPress={submitFn}
            />
        </HeaderButtons>,
    }
}

const styles=StyleSheet.create({
    form:{
        margin:20,
    },
    formControl:{
        width:'100%'
    },
    label:{
        fontFamily:'open-sans-bold',
        marginVertical:8
    },
    input:{
        paddingHorizontal:2,
        paddingVertical:5,
        borderBottomColor:'#CCC',
        borderBottomWidth:1
    },

})

export default EditProductScreen;