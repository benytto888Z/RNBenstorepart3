import Order from "../../models/Order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDER = 'SET_ORDERS';

export const fetchOrders = () =>{
    return async (dispatch,getState) =>{
        const userId = getState().auth.userId;
        try{
            //any async code here
            const response = await fetch(`https://rn-benstore.firebaseio.com/orders/${userId}.json`)
                // method :'GET', il y a GET par défaut;
   
            if(!response.ok){
                throw new Error('Quelque chose n\'a pas marché ! ');
            }
   
            const resData = await response.json();
            //console.log(resData);
            const loadedOrders = [];
   
            for(const key in resData){
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                     new Date(resData[key].date),
                    )
                );
            }
            dispatch({type:SET_ORDER,orders:loadedOrders});
        }catch (error) {
            // send to custom analytics server
            throw error;
        }
    };
       
}

export const addOrder = (cartItems,totalAmount)=>{
    return async (dispatch,getState) => {
        const date = new Date();
        const token = getState().auth.token;
        const userId = getState().auth.userId;

        const response = await fetch(`https://rn-benstore.firebaseio.com/orders/${userId}.json?auth=${token}`,{
            method :'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                cartItems,
                totalAmount,
                date:date.toISOString()
            })
        });

        if(!response.ok){
            throw Error('Quelque chose n\'a pas marché');
        }

        // when this is done we get back the response data
        // with a generate Id from firebase
        const resData = await response.json();

      dispatch({
        type:ADD_ORDER,
        orderData:{
            id:resData.name,
            items:cartItems,
            amount:totalAmount,
            date:date
        }
    });
    }

}