import React, {useEffect, useCallback, useReducer} from 'react';
import {View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {useSelector, useDispatch} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';

import * as productsAction from '../../store/actions/products';
import Input from '../../components/UI/Input';

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
/////////////////////////////////////////////////////////////
const EditProductScreen = props => {

    //1--- recupération de l'id du produit à modifier
    const prodId = props.navigation.getParam('productId');
    //2---- trouver le produit par rapport à son id
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );

    const dispatch = useDispatch();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: '' // we do not need this in case of editProduct
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false,

    })

    //----------------------------------------

    // useCallback this ensure that this function is not recreated everytime the component re-renders
    // and therefore we avoid infinite loop
    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Champs invalides', 'veuillez vérifier les erreurs dans votre formulaire',
                [
                    {text: 'Ok'}
                ]);
            return;
        }
        if (editedProduct) {
            dispatch(productsAction.updateProduct(
                prodId,
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl,
            ))
        } else {
            dispatch(productsAction.createProduct(
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl,
                +formState.inputValues.price // conversion en nombre sinon erreur
            ))
        }
        props.navigation.goBack();
    }, [dispatch, prodId, formState]);// we pass empty array to avoid re-rendres every time seconds
    //----------------------------------
    useEffect(() => {
        props.navigation.setParams({submit: submitHandler})
    }, [submitHandler]);
    //-----------------------------------
    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);
    //----------------------------------------
    return (
        // 3---affichage du produit à modifier ou si un nouveau produit les champs sont vides
        <KeyboardAvoidingView
            style={{flex:1}}
            behavior="padding"
            keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Nom'
                        errorText='Entrer une valeur valide'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeytype='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''} //4-- recupère le nom du produit dans le champ
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='Image'
                        errorText="Entrer un chemin d'image valide"
                        keyboardType='default'
                        returnKeytype='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {/*ne pas afficher le prix quand on est en modif*/}
                    {editedProduct ? null :
                        <Input
                            id='price'
                            label='Prix'
                            errorText='Entrer un prix valide'
                            keyboardType="decimal-pad"
                            returnKeytype='next'
                            onInputChange={inputChangeHandler}
                            required
                            min={0.1}
                        />
                    }
                    <Input
                        id='description'
                        label='Description'
                        errorText='Entrer une description valide'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}
////////////////////////////////////////////////////////////////////////
EditProductScreen.navigationOptions = (navData) => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Modification de produit' : 'Ajout de produit',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Valider' iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                  onPress={submitFn}
            />
        </HeaderButtons>,
    }
}

///////////////////////////////////////
const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
})

export default EditProductScreen;