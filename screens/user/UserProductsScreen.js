import React from 'react';
import {Button, FlatList, Platform,Alert} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from "../../constants/Colors";
import * as ProductsActions from "../../store/actions/products";

const UserProductsScreen = props =>{
    const userProducts = useSelector(state=>state.products.userProducts)
    const dispatch=useDispatch();
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

export default UserProductsScreen;