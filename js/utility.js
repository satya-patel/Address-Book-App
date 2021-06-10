const checkFullName = (fullName) => {
    let fullNameRegex = RegExp(/^[A-Z][a-z]{2,}/);
    if (!fullNameRegex.test(fullName)) throw 'FullName is Incorrect';
}

const checkAddress = (address) => {
    let addressRegex = RegExp('([A-Z a-z 0-9]{3,})+');
    if (!addressRegex.test(address)) throw 'Address is Incorrect';
}

const checkPhoneNo = (phoneNo) => {
    let phoneNoRegex = RegExp('((^\\+?)(([0-9]{2,3})(\\s))?)' + '[0-9]{10}$');
    if (!phoneNoRegex.test(phoneNo)) throw 'PhoneNumber is Incorrect';
}