import Product from "../../models/Product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS    ='SET_PRODUCTS';

export const fetchProducts = () =>{
 return async (dispatch,getState) => {
    const userId = getState().auth.userId;
     try{
         //any async code here
         const response = await fetch('https://rn-benstore.firebaseio.com/products.json')
             // method :'GET', il y a GET par défaut;

         if(!response.ok){
             throw new Error('Quelque chose n\'a pas marché ! ');
         }

         const resData = await response.json();
         //console.log(resData);
         const loadedProducts = [];

         for(const key in resData){
             loadedProducts.push(new Product(
                 key,
                 resData[key].ownerId,
                 resData[key].title,
                 resData[key].imageUrl,
                 resData[key].description,
                 resData[key].price
                 )
             );
         }
         dispatch({
             type:SET_PRODUCTS,
             products:loadedProducts,
             userProducts:loadedProducts.filter(prod=>prod.ownerId === userId)
         })
     }catch (error) {
         // send to custom analytics server
         throw error;
     }
 };
};

export const deleteProduct=productId=>{
    return async (dispatch,getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-benstore.firebaseio.com/products/${productId}.json?auth=${token}`,{
            method :'DELETE',
        });

        if(!response.ok){
            throw new Error('Il y a un problème veuillez réessayer');
        }

        dispatch({
            type:DELETE_PRODUCT,
            pid:productId
        })
    };

}

export const createProduct = (title,description,imageUrl,price)=>{
    return async (dispatch,getState) => {
        //any async code here
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-benstore.firebaseio.com/products.json?auth=${token}`,{
            method :'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId:userId
            })
        });
        const resData = await response.json();
        dispatch( {
            type: CREATE_PRODUCT,
            productData:{
                id:resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId:userId
            }

        });
    }

}

export const updateProduct = (id,title,description,imageUrl)=>{
    return async (dispatch,getState) => {
        //console.log(getState());

        const token = getState().auth.token;

        const response = await fetch(`https://rn-benstore.firebaseio.com/products/${id}.json?auth=${token}`,{
            method :'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                title,
                description,
                imageUrl,
            })
        });

        if(!response.ok){
            throw new Error('Il y a un problème veuillez réessayer');
        }
       dispatch({
            type: UPDATE_PRODUCT,
            pid:id,
            productData:{
                title,
                description,
                imageUrl,
            }

        });
    }

}