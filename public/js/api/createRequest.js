/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {url, data, method, callback}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    //if GET => add parameters into url
    if (options.method === "GET") {
        if (typeof(options.data) === "string") {
            options.url += "/" + options.data
        }
        else {
            options.url += "?";
            for (prop in options.data) {
                options.url += prop + "=" + (options.data)[prop] + "&";
            }
        }
    }
    //if POST => create FormData and info into it
    else {
        formData = new FormData;

        for (prop in options.data) {
            formData.append(prop, (options.data)[prop]);
        }
    }
    xhr.open(options.method, options.url);
    
    //send data
    if (options.method === "GET") {
        xhr.send();
    }
    else {
        xhr.send(formData);
    }

    //call callback function when request is uploaded or when error occurs
    xhr.addEventListener("load", (e) => {
        if (xhr.response.success) {
            options.callback(null, xhr.response);
        }
        else {
            options.callback(new Error(xhr.response.error), null);
        }
    });

    xhr.addEventListener("error", (e) => {
        options.callback(new Error(xhr.statusText), null);
    });

};
