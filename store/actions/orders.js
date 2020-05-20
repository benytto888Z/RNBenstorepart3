export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (cartItems,totalAmount)=>{
    return async dispatch => {
        const date = new Date();
        const response = await fetch('https://rn-benstore.firebaseio.com/orders/u1.json',{
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