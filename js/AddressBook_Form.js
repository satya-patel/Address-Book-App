let isUpdate = false;
let addressBookContactJSONObject = {};

window.addEventListener('DOMContentLoaded', (event) => {
    const fullName = document.querySelector('#fullName');
    fullName.addEventListener('input', function () {
        if (fullName.value.length == 0) {
            setTextValue('.text-error', "");
            return
        }
        try {
            checkFullName(fullName.value)
            setTextValue('.text-error', "");
        } catch (e) {
            setTextValue('.text-error', e);
        }
    });

    const phoneNo = document.querySelector('#tel');
    phoneNo.addEventListener('input', function () {
        if (phoneNo.value.length == 0) {
            setTextValue('.mobno-error', "");
            return;
        }
        try {
            checkPhoneNo(phoneNo.value);
            setTextValue('.mobno-error', "");
        } catch (e) {
            setTextValue('.mobno-error', e);
        }
    });

    const address = document.querySelector('#address');
    address.addEventListener('input', function () {
        if (address.value.length == 0) {
            setTextValue('.address-error', "");
            return;
        }
        try {
            checkAddress(address.value);
            setTextValue('.address-error', "");
        } catch (e) {
            setTextValue('.address-error', e);
        }
    });

    checkForUpdate();
});

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setAddressBookContactObject();
        if(site_properties.use_local_storage.match("true")) {
            createAndUpdateLocalStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        } else {
            createOrUpdateAddressBookList();
        }
    } catch (e) {
        alert(e);
        return;
    }
}

const createOrUpdateAddressBookList = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate) {
        methodCall = "PUT";
        postURL = postURL + '/' + addressBookContactJSONObject.id.toString();
    }
    makeServiceCall(methodCall, postURL, true, addressBookContactJSONObject)
        .then(responseText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });    
}


const setAddressBookContactObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")) {
        addressBookContactJSONObject.id = createNewContactId();
    }
    addressBookContactJSONObject._fullName = getInputValueById('#fullName');
    addressBookContactJSONObject._address = getInputValueById('#address');
    addressBookContactJSONObject._phoneNumber = getInputValueById('#tel');
    addressBookContactJSONObject._city = getInputValueById('#city');
    addressBookContactJSONObject._state = getInputValueById('#state');
    addressBookContactJSONObject._zip = getInputValueById('#zip');
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const createAndUpdateLocalStorage = () => {
    let contactList  = JSON.parse(localStorage.getItem("AddressBookList"));
    if (contactList ) {
        let contactData = contactList 
                            .find(contact => contact.id == addressBookContactJSONObject.id);
        if(!contactData) {
            contactList.push(addressBookContactJSONObject);
        }
        else {
            const index = contactList
                            .map(contact => contact.id)
                            .indexOf(contactData.id);
            contactList.splice(index, 1, addressBookContactJSONObject);
        }
    } else {
        contactList = [addressBookContactJSONObject];
    }
    localStorage.setItem("AddressBookList", JSON.stringify(contactList));
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const resetForm = () => {
    setValue('#fullName', '');
    setValue('#address', '');
    setValue('#tel', '');
    setValue('#city', '');
    setValue('#state', '');
    setValue('#zip', '');
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const checkForUpdate = () => {
    const contactJson = localStorage.getItem('editContact');
    isUpdate = contactJson ? true : false;
    if (!isUpdate) return;
    addressBookContactJSONObject = JSON.parse(contactJson);
    setForm();
}

const setForm = () => {
    setValue('#fullName', addressBookContactJSONObject._fullName);
    setValue('#address', addressBookContactJSONObject._address);
    setValue('#tel', addressBookContactJSONObject._phoneNumber);
    setValue('#city', addressBookContactJSONObject._city);
    setValue('#state', addressBookContactJSONObject._state);
    setValue('#zip', addressBookContactJSONObject._zip);
}

const createNewContactId = () => {
    let contactId = localStorage.getItem("ContactID");
    contactId = !contactId ? 1 : (parseInt(contactId) + 1).toString();
    localStorage.setItem("ContactID", contactId);
    return contactId;
}
