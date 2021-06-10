let contactList;

window.addEventListener('DOMContentLoaded', (event) => {
    if(site_properties.use_local_storage.match("true")) {
        getContactListFromLocalStorage();
    } else getContactListFromServer();
});

const getContactListFromLocalStorage = () => {
    contactList = localStorage.getItem('AddressBookList') ?
    JSON.parse(localStorage.getItem('AddressBookList')) : [];
    processcontactListDataResponse();
}

const processcontactListDataResponse = () => {
    document.querySelector(".contact-count").textContent = contactList.length;
    createInnerHtml();
    localStorage.removeItem('editContact');
}

const getContactListFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(responseText => {
            contactList = JSON.parse(responseText);
            processcontactListDataResponse();
        })
        .catch(error => {
            console.log("GET Error Status: " + JSON.stringify(error));
            contactList = [];
            processcontactListDataResponse();
        })
}

const createInnerHtml = () => {
    if (contactList.length == 0) return;
    const headerHtml = "<th>Full Name</th><th>Address</th>" +
        "<th>City</th><th>State</th><th>Zip Code</th><th>Phone Number</th><th>Actions</th>";
    let innerHtml = `${headerHtml}`;
    for (const contact of contactList) {
        innerHtml = `${innerHtml}
<tr>
    <td>${contact._fullName}</td>
    <td>${contact._address}</td>
    <td>${contact._city}</td>
    <td>${contact._state}</td>
    <td>${contact._zip}</td>
    <td>${contact._phoneNumber}</td>
    <td>
        <img src="../assets/icons/delete-black-18dp.svg" alt="delete" id="${contact.id}" onclick="remove(this)">
        <img src="../assets/icons/create-black-18dp.svg" alt="edit" id="${contact.id}" onclick="update(this)">
    </td>
</tr>
    `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}

const remove = (node) => {
    let contact = contactList.find(contactInList => contactInList.id == node.id);
    if (!contact) return;
    const index = contactList
                        .map(contactInList => contactInList.id)
                        .indexOf(contact.id);
    contactList.splice(index, 1);

    if(site_properties.use_local_storage.match("true")) {
        localStorage.setItem("AddressBookList", JSON.stringify(contactList));
        document.querySelector(".contact-count").textContent = contactList.length;
        createInnerHtml();
    } else {
        const deleteURL = site_properties.server_url + '/' + contact.id.toString();
        makeServiceCall("DELETE", deleteURL, true)
            .then(responseText => {
                document.querySelector(".contact-count").textContent = contactList.length;
                createInnerHtml();
            })
            .catch(error => {
                console.log("DELETE Error Status: " + JSON.stringify(error));
            });
    }

    
} 

const update = (node) => {
    let contact = contactList.find(contactInList => contactInList.id == node.id);
    if (!contact) return;
    localStorage.setItem('editContact', JSON.stringify(contact));
    window.location.replace(site_properties.add_address_book_form_page);
}