export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDs_3mxPnAO89Yr7Nie5liNB3jKmUQmUe4',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      // console.log(errorResData);
      let message = "Quelque chose n'a pas marché !";
      const errorId = errorResData.error.message;

      if (errorId === 'EMAIL_EXISTS') {
        message = "cet email existe déjà";
      } 
      throw new Error(message);

    }

    const resData = await response.json();
    /*console.log(resData);*/

    dispatch({
       type: SIGNUP,
       token: resData.idToken,
       userId:resData.localId
      })

  }
}


export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDs_3mxPnAO89Yr7Nie5liNB3jKmUQmUe4',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      // console.log(errorResData);
      let message = "Quelque chose n'a pas marché !";
      const errorId = errorResData.error.message;

      if (errorId === 'EMAIL_NOT_FOUND') {
        message = "cet email n'existe pas";
      } else if (errorId === 'INVALID_PASSWORD') {
          message = "Ce mot de passe n'est pas valide";
      }

      throw new Error(message);

    }

    const resData = await response.json();

    dispatch({ 
      type: LOGIN,
      token: resData.idToken,
      userId:resData.localId 
    })

  }
}