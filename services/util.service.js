import {to} from "await-to-js";


export const too = async (promise) => {
    let err, res;
   
    [err, res] = await to(promise);
    if (err){
        return [err, null]
    };
    return [null, res];
};

export const isEmpty=(obj)=> {
    return !Object.keys(obj).length > 0;
}


export const ReE = function (res, err, code) { // Error Web Response
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: false, error: err });
};

export const ReS = function (res, data, code) { // Success Web Response
    let send_data = { success: true };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if (typeof code !== ' undefined') res.statusCode = code;

    return res.json(send_data)
};

export const isNull=(field)=> {
    return typeof field === 'undefined' || field === '' || field === null
}


export const isEmail = async (email_id) => {
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(email_id)) {
        return true
    }
    else {
        return false
    }
}

export const firstNameSecondNameCapForReg = (data) => {
  
    let normal = String(data).toLowerCase();
    
    if (normal.length < 0) {
  
  
      return '';
        
    } else {
  
      // Split the name into an array of words
      var words = data.split(' ');
  
      // Convert the first letter of the first name to uppercase
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  
      // Convert the first letter of the last name to uppercase
      if (words.length > 1) {
          var lastWordIndex = words.length - 1;
          words[lastWordIndex] = words[lastWordIndex].charAt(0).toUpperCase() + words[lastWordIndex].slice(1);
      }
  
      // Join the words back into a string
      var convertedName = words.join(' ');
  
      return convertedName;
  
    }

}

export const uppperEveryWord = (data) => {
  
    let normal = String(data).toLowerCase();

    if (normal.length === 0) {
        return '';
    } else {
        // Split the name into an array of words
        const words = normal.split(' ');

        // Capitalize the first letter of each word
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

        // Join the words back into a string
        const convertedName = capitalizedWords.join(' ');

        return convertedName;
    }

}