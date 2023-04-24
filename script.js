const header = document.querySelector("#header");
const list = document.querySelector(".list");
const button = document.querySelector(".my-button");
const nameInput = document.querySelector(".nameInput");
const priceInput = document.querySelector(".priceInput");
const amountInput = document.querySelector(".amountInput");
const authenticate = document.querySelector(".authenticate");
const resources = document.querySelector(".resources");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const createAcctBut = document.querySelector(".createAcct-button");
const regisConfirm = document.querySelector(".register-button");
const firstRegis = document.querySelector(".firstRegis");
const lastRegis = document.querySelector(".lastRegis");
const emailRegis = document.querySelector(".emailRegis");
const passRegis = document.querySelector(".passRegis");
const loginBut = document.querySelector(".login-button");
const emailLogin = document.querySelector(".emailLogin");
const passLogin = document.querySelector(".passLogin");
const loginFail = document.querySelector(".loginFail");
const registerFail = document.querySelector(".registerFail");
const loginReturnBut = document.querySelector(".loginReturn-button");

var Items = [];

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

var url = "https://s23-deploy-zakb3005-production.up.railway.app/"

function loadItemsFromServer() {
    fetch(url + "items", {
        credentials: 'include'
    }).then(function(response) {
        if (response.status == 401) {
            authenticate.style.display = "inline";
            resources.style.display = "none";
            login.style.display = "inline";
            register.style.display = "none";
        } else {
            authenticate.style.display = "none"
            resources.style.display = "inline";
            response.json().then(function(data){
                console.log("Data received from server:",data);
                Items = data;
                console.log("Items:",Items);

                list.innerHTML = "";

                Items.forEach(function(item) {
                    var itemDiv = document.createElement("div");
                    itemDiv.classList.add("list");

                    var newItem = document.createElement("button");
                    newItem.innerHTML = item.name;
                    itemDiv.appendChild(newItem);
                    newItem.classList.add("item");
                    newItem.classList.add("itemName");
                    if (item.checked) {
                        newItem.style.textDecoration = "line-through";
                    }

                    var itemPrice = document.createElement("button");
                    itemPrice.innerHTML = formatter.format(item.cost);

                    itemDiv.appendChild(itemPrice);
                    itemPrice.classList.add("item");
                    itemPrice.classList.add("itemPrice");

                    var itemNum = document.createElement("button");
                    itemNum.innerHTML = item.amount;
                    itemDiv.appendChild(itemNum);
                    itemNum.classList.add("item");
                    itemNum.classList.add("itemAmount");
                    
                    var editDiv = document.createElement("div");
                    editDiv.style.display = "none";
                    editDiv.classList.add("list");

                    var editName = document.createElement("input");
                    editName.type = "text";
                    editName.classList.add("input");
                    editName.classList.add("nameInput");
                    editName.classList.add("edit");
                    editName.placeholder = "Item Name";
                    editDiv.appendChild(editName);

                    var editCost = document.createElement("input");
                    editCost.type = "text";
                    editCost.classList.add("input");
                    editCost.classList.add("priceInput");
                    editCost.classList.add("edit");
                    editCost.placeholder = "Cost";
                    editDiv.appendChild(editCost);

                    var editAmount = document.createElement("input");
                    editAmount.type = "text";
                    editAmount.classList.add("input");
                    editAmount.classList.add("amountInput");
                    editAmount.classList.add("edit");
                    editAmount.placeholder = "#";
                    editDiv.appendChild(editAmount);

                    var applyBut = document.createElement("button");
                    applyBut.classList.add("button");
                    applyBut.classList.add("my-button");
                    applyBut.classList.add("edit");
                    applyBut.innerHTML = "Apply";
                    editDiv.appendChild(applyBut);

                    var interactDiv = document.createElement("div");
                    interactDiv.style.display = "none";
                    interactDiv.classList.add("list");
                    interactDiv.classList.add("interact");

                    var markBut = document.createElement("button");
                    markBut.classList.add("button");
                    markBut.classList.add("my-button");
                    markBut.classList.add("mark-button");
                    markBut.classList.add("interact");
                    markBut.innerHTML = "Mark as Complete";
                    interactDiv.appendChild(markBut);
                    
                    var editBut = document.createElement("button");
                    editBut.classList.add("button");
                    editBut.classList.add("my-button");
                    editBut.classList.add("interact");
                    editBut.innerHTML = "Edit";
                    interactDiv.appendChild(editBut);

                    var deleteBut = document.createElement("button");
                    deleteBut.classList.add("button");
                    deleteBut.classList.add("my-button");
                    deleteBut.classList.add("interact");
                    deleteBut.innerHTML = "Delete";
                    interactDiv.appendChild(deleteBut);

                    var lastEdit = document.createElement("div");
                    lastEdit.style.display = "none";
                    lastEdit.classList.add("list");
                    lastEdit.classList.add("interact");
                    lastEdit.innerHTML = "Last Modified: "+item.date;
                    interactDiv.appendChild(lastEdit);

                    editBut.onclick = function() {
                        if (editDiv.style.display == "none") {
                            editName.value = item.name;
                            editCost.value = item.cost;
                            editAmount.value = item.amount;
                            editDiv.style.display = "block";
                            lastEdit.style.display = "block";
                        } else {
                            editDiv.style.display = "none";
                            lastEdit.style.display = "none";
                        }
                    };

                    newItem.onclick = function() {
                        if (interactDiv.style.display == "none") {
                            interactDiv.style.display = "block";
                        } else {
                            interactDiv.style.display = "none";
                            editDiv.style.display = "none";
                            lastEdit.style.display = "none";
                        }
                    };

                    deleteBut.onclick = function() {
                        console.log("Delete was clicked");
                        if (confirm("Are you sure you want to delete this item?")) {
                            deleteItemFromServer(item.id);
                        }
                    };

                    applyBut.onclick = function() {
                        if (editName.value != "" && editCost.value != "" && editAmount.value != "") {
                            item_name = editName.value;
                            item_cost = editCost.value;
                            item_amount = editAmount.value;
                            item_checked = 0;
                            if (newItem.style.textDecoration == "line-through") {
                                item_checked = 1;
                            }
                            item_date = getDate();
                            
                            updateItemOnServer(item_name,item_cost,item_amount,item_checked,item_date,item.id,true);
                        }
                    };
                    
                    markBut.onclick = function() {
                        item_checked = item.checked;
                        if (newItem.style.textDecoration != "line-through") {
                            newItem.style.textDecoration = "line-through";
                            item_checked = 1;
                        } else {
                            newItem.style.textDecoration = "none";
                            item_checked = 0;
                        }

                        item_name = item.name;
                        item_cost = item.cost;
                        item_amount = item.amount;
                        item_date = item.date;
                        updateItemOnServer(item_name,item_cost,item_amount,item_checked,item_date,item.id,false);
                    }
                    
                    list.appendChild(itemDiv);
                    list.appendChild(interactDiv);
                    list.appendChild(editDiv);
                });
            });
        };
    });
}

function deleteItemFromServer(itemId) {
    fetch(url + "items/" + itemId, {
        method: "DELETE",
        credentials: 'include'
    }).then(function(response){
        if (response.status == 200) {
            loadItemsFromServer();
        } else {
            console.log("server responded with",response.status,"when attempting to delete an item");
        }
    });
}

/* add more parameters for each field */
function createItemOnServer(item_name,item_cost,item_amount,item_checked,item_date) {
    console.log("attempting to create item",item_name,"on server.");

    var data = "name=" + encodeURIComponent(item_name);
    data += "&cost=" + encodeURIComponent(item_cost);
    data += "&amount=" + encodeURIComponent(item_amount);
    data += "&checked=" + encodeURIComponent(item_checked);
    data += "&date=" + encodeURIComponent(item_date);
    console.log("sending data to server:", data);

    fetch(url + "items",{ 
        //request details:
        method: "POST",
        body: data,
        credentials: 'include',
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        //when the server responds:
        if (response.status == 201) {
            loadItemsFromServer();
        } else {
            console.log("server responded with",response.status,"when attempting to create an item");
        }
    });
}

function createUserOnServer(first_name,last_name,user_email,user_pass) {
    console.log("attempting to create user",user_email,"on server.");

    var data = "first=" + encodeURIComponent(first_name);
    data += "&last=" + encodeURIComponent(last_name);
    data += "&email=" + encodeURIComponent(user_email);
    data += "&password=" + encodeURIComponent(user_pass);
    console.log("sending data to server:", data);

    fetch(url + "users",{ 
        //request details:
        method: "POST",
        body: data,
        credentials: 'include',
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        //when the server responds:
        if (response.status == 201) {
            login.style.display = "inline";
            register.style.display = "none";
            registerFail.style.opacity = 0;
        } else {
            registerFail.style.opacity = 1;
            console.log("server responded with",response.status,"when attempting to create a user");
        }
    });
}

function createSessionOnServer(user_email,user_pass) {
    console.log("attempting to create session for",user_email,"on server.");

    var data = "email=" + encodeURIComponent(user_email);
    data += "&password=" + encodeURIComponent(user_pass);
    console.log("sending data to server:", data);

    fetch(url + "sessions",{ 
        //request details:
        method: "POST",
        body: data,
        credentials: 'include',
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        //when the server responds:
        if (response.status == 201) {
            authenticate.style.display = "none"
            resources.style.display = "inline";
            loginFail.style.opacity = 0;
            loadItemsFromServer();
        } else {
            loginFail.style.opacity = 1;
            console.log("server responded with",response.status,"when attempting to create a session");
        }
    });
}

function updateItemOnServer(item_name,item_cost,item_amount,item_checked,item_date,item_id,reload) {
    console.log("attempting to update item",item_name,"on server.");

    var data = "name=" + encodeURIComponent(item_name);
    data += "&cost=" + encodeURIComponent(item_cost);
    data += "&amount=" + encodeURIComponent(item_amount);
    data += "&checked=" + encodeURIComponent(item_checked);
    data += "&date=" + encodeURIComponent(item_date);
    console.log("sending data to server:", data);

    fetch(url + "items/" +item_id,{ 
        //request details:
        method: "PUT",
        body: data,
        credentials: 'include',
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        //when the server responds:
        if (response.status == 200) {
            if (reload) {
                loadItemsFromServer();
            }
        } else {
            console.log("server responded with",response.status,"when attempting to create an item");
        }
    });
}

function getDate() {
    var item_date = new Date();
    var dd = String(item_date.getDate()).padStart(2, '0');
    var mm = String(item_date.getMonth() + 1).padStart(2, '0');
    var yyyy = item_date.getFullYear();
    item_date = mm + '/' + dd + '/' + yyyy;
    return item_date;
}

loadItemsFromServer();

button.onclick = function() {
    if (nameInput.value != "" && priceInput.value != "" && amountInput.value != "") {
        item_name = nameInput.value;
        item_cost = priceInput.value;
        item_amount = amountInput.value;
        item_checked = 0;
        item_date = getDate();
        
        createItemOnServer(item_name,item_cost,item_amount,item_checked,item_date);
        nameInput.value = "";
        priceInput.value = "";
        amountInput.value = "";
    };
};

createAcctBut.onclick = function() {
    login.style.display = "none";
    register.style.display = "inline";
    registerFail.style.opacity = 0;
};

loginReturnBut.onclick = function() {
    login.style.display = "inline";
    register.style.display = "none";
    loginFail.style.opacity = 0;
};

regisConfirm.onclick = function() {
    if (firstRegis.value != "" && lastRegis.value != "" && emailRegis.value != "" && passRegis.value != "") {
        first_name = firstRegis.value;
        last_name = lastRegis.value;
        user_email = emailRegis.value;
        user_pass = passRegis.value;

        createUserOnServer(first_name,last_name,user_email,user_pass);
        firstRegis.value = "";
        lastRegis.value = "";
        emailRegis.value = "";
        passRegis.value = "";
    };
};

loginBut.onclick = function() {
    if (emailLogin.value != "" && passLogin.value != "") {
        user_email = emailLogin.value;
        user_pass = passLogin.value;

        createSessionOnServer(user_email,user_pass);
        emailLogin.value = "";
        passLogin.value = "";
    };
};