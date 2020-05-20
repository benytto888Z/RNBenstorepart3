import React,{useState,useEffect,useCallback} from 'react';
import {FlatList, Button,Text, Platform,View,ActivityIndicator,StyleSheet} from 'react-native';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import {useSelector,useDispatch} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as productsActions from "../../store/actions/products";
import * as CartActions from "../../store/actions/cart";
import Colors from "../../constants/Colors";




const ProductsOverviewScreen = props => {
    const [isLoading,setIsLoading] = useState(false);
    const [isRefreshing,setIsRefreshing]=useState(false);
    const [error,setError] = useState(false);
    const products = useSelector(state=>state.products.availableProducts);
    const dispatch=useDispatch();

    const loadProducts = useCallback(async () => {
      //  console.log('LOAD PRODUCTS');
        setError(null);
        setIsRefreshing(true);
       // setIsLoading(true);
        try{
            await dispatch(productsActions.fetchProducts());
        }catch(err){
            setError(err.message);
        }
        //setIsLoading(false);
        setIsRefreshing(false);
    },[dispatch,setIsLoading,setError]);

    // the navigation listener
     useEffect(()=>{
      const willFocusSub =  props.navigation.addListener('willFocus',loadProducts) // didFocus , willBlur,didBlur
      return ()=>{
        willFocusSub.remove();
      };
     },[loadProducts])


    useEffect(()=>{
    setIsLoading(true);
     loadProducts().then(()=>{
        setIsLoading(false);
     });
    },[dispatch,loadProducts]);

    const selectItemHandler = (id,title)=>{
        props.navigation.navigate('ProductDetail',{
            productId:id,
            productTitle:title
        })
    };

    if(error){
        return (
            <View style={styles.centered}>
                <Text>Une erreur s'est produite !</Text>
                <Button title="Veuillez réessayer" color={Colors.primary}/>
            </View>
        )
    }

    if(isLoading){
        return (
        <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
        )
    }

    if(!isLoading && products.length === 0){
        return (
            <View style={styles.centered}>
                <Text>Pas de produit dans la base</Text>
            </View>
        )
    }

    return(
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            keyExtrator={item =>item.id}
            data={products}
            renderItem={itemData=><ProductItem product={itemData.item}
             onSelect={()=>{
                selectItemHandler(itemData.item.id,itemData.item.title)
             }}

            >
                <Button color={Colors.primary} title="Détails" onPress={()=>{
                        selectItemHandler(itemData.item.id,itemData.item.title)
                    }
                }
                />
                <Button color={Colors.primary} title="+ Panier" onPress={()=>{
                    dispatch(CartActions.addToCart(itemData.item))
                }
                }/>
            </ProductItem>

            }
        />
    );
}

ProductsOverviewScreen.navigationOptions=(navData)=>{
return{
    headerTitle : 'Tous les produits',
    headerLeft:()=><HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
              onPress={()=>{
                  navData.navigation.toggleDrawer();
              }}
        />
    </HeaderButtons>,

    headerRight: ()=><HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              onPress={()=>{
                    navData.navigation.navigate('Cart');
              }}
        />
    </HeaderButtons>
 }

};

const styles = StyleSheet.create({
centered:{flex:1,justifyContent:'center',alignItems:'center'}
});

export  default  ProductsOverviewScreen;