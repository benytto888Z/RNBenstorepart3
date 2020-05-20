import React from 'react';
import {FlatList, Platform, Text,StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from "../../components/shop/OrderItem";


const OrdersScreen = props => {
/*const [isLoading,setIsLoading]=useState(false);
const [error,setError]=useState(false);*/

const orders = useSelector(state => state.orders.orders);


/*
const loadOrders=useCallback(async()=>{
    setError(null);
    setIsLoading(true);
    try{
         await dispatch(OrdersActions.fetchOrders());
    }catch(err){
        setError(err.message);
    }
   setIsLoading(false);
},[dispatch,setError,setIsLoading]);


useEffect(()=>{
    loadOrders();
},[dispatch]);
*/

 //---------------------------------------
/*
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

if(!isLoading && orders.length === 0){
    return (
        <View style={styles.centered}>
            <Text>Aucun article commandé</Text>
        </View>
    )
}
*/
//----------------------------------------------


return <FlatList
        data={orders}
        keyExtractor={item=>item.id}
        renderItem={itemData=>
            <OrderItem
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}
                items={itemData.item.items}
            />
        }
    />
};

OrdersScreen.navigationOptions =navData => {
    return{
        headerTitle: 'Tes Commandes',
        headerLeft:()=><HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                  onPress={()=>{
                      navData.navigation.toggleDrawer();
                  }}
            />
        </HeaderButtons>,
    };

}

const styles = StyleSheet.create({
    centered:{flex:1,justifyContent:'center',alignItems:'center'}
    });

export default OrdersScreen;