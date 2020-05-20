import React,{useState,useEffect,useCallback} from 'react';
import {Button, FlatList, Platform,Alert,View,ActivityIndicator,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from "../../constants/Colors";
import * as ProductsActions from "../../store/actions/products";

const UserProductsScreen = props =>{
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState(false);

    const userProducts = useSelector(state=>state.products.userProducts)
    const dispatch=useDispatch();

    const loadUserProducts=useCallback(async()=>{
        setError(null);
        setIsLoading(true);
        try{
             await dispatch(ProductsActions.fetchProducts());
        }catch(err){
            setError(err.message);
        }
       setIsLoading(false);
    },[dispatch,setError,setIsLoading]);


      // the navigation listener
      useEffect(()=>{
        const willFocusSub =  props.navigation.addListener('willFocus',loadUserProducts) // didFocus , willBlur,didBlur
        return ()=>{
          willFocusSub.remove();
        };
       },[loadUserProducts])

       //------------------------------------

        useEffect(()=>{
            loadUserProducts();
        },[dispatch,loadUserProducts]);


    //-----------------------------------------

    const editProductHandler=(id)=>{
        props.navigation.navigate('EditProduct',{productId:id});
    };

    const deleteHandler=(id)=>{
        Alert.alert('Etes-vous sûr ?', 'Voulez-vous vraiment supprimer ce produit ? ',
            [
                {text:'Non' , style:'default'},
                {text:'Oui' , style:'destructive',onPress:()=>{
                    dispatch(ProductsActions.deleteProduct(id))
                 }},
            ]);
    };


    //---------------------------------------

    if(error){
        return (
            <View style={styles.centered}>
                <Text>Une erreur s'est produite !</Text>
                <Button title="Veuillez réessayer" color={Colors.primary}/>
            </View>
        )
    }

    //------------------------------------------

    if(isLoading){
        return (
        <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
        )
    }

    if(!isLoading && userProducts.length === 0){
        return (
            <View style={styles.centered}>
                <Text>Pas de produit dans la base</Text>
            </View>
        )
    }

    //----------------------------------------------

    return <FlatList
        data={userProducts}
        keyExtractor={item=>item.id}
        renderItem={itemData=><ProductItem
            product={itemData.item}
            onSelect={()=>{
                editProductHandler(itemData.item.id)
            }}
        >
            <Button color={Colors.primary} title="Modifier" onPress={()=>{
                editProductHandler(itemData.item.id)
            }
            }
            />
            <Button color={Colors.primary} title="Supprimer"
                    onPress={()=>deleteHandler(itemData.item.id)}
            // ou faire onPress={deleteHandler.bind(this,itemData.item.id)}
            />
        </ProductItem>
        }
     />
}

    //------------------------------------------------

UserProductsScreen.navigationOptions=(navData)=> {
    return {
        headerTitle: 'Produits',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                  onPress={() => {
                      navData.navigation.toggleDrawer();
                  }}
            />
        </HeaderButtons>,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Add' iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                  onPress={() => {
                      navData.navigation.navigate('EditProduct')
                  }}
            />
        </HeaderButtons>,
    }
}

const styles = StyleSheet.create({
    centered:{flex:1,justifyContent:'center',alignItems:'center'}
    });

export default UserProductsScreen;