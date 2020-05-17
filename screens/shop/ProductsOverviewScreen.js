import React from 'react';
import {FlatList, Button, Platform, View} from 'react-native';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import {useSelector,useDispatch} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as CartActions from "../../store/actions/cart";
import Colors from "../../constants/Colors";



const ProductsOverviewScreen = props => {
    const products = useSelector(state=>state.products.availableProducts);
    const dispatch=useDispatch();

    const selectItemHandler = (id,title)=>{
        props.navigation.navigate('ProductDetail',{
            productId:id,
            productTitle:title
        })
    };

    return(
        <FlatList
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

export  default  ProductsOverviewScreen;