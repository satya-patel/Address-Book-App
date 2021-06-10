class AddressBookContact {

    id;

    //Getters & Setters

    get fullName() {
        return this._fullName;
    }
    set fullName(fullName) {
        let fullNameRegex = RegExp(/^[A-Z][a-z]{2,}/);
        if (fullNamePattern.test(fullName)) {
            this._fullName = fullName;
        }
        else
            throw 'Invalid FullName !';
    }
    get address() {
        return this._address;
    }
    set address(address) {
        let words = address.split(" ");
        let addressPattern = RegExp('([A-Z a-z 0-9]{3,})+');
        for (const word of words) {
            if (!addressPattern.test(word))
                throw 'Invalid Address !';
        }
        this._address = address;
    }
    get city() {
        return this._city;
    }
    set city(city) {
        this._city = city;
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }
    get zip() {
        return this._zip;
    }
    set zip(zip) {
        this._zip = zip;
    }
    get phoneNumber() {
        return this._phoneNumber;
    }
    set phoneNumber(phoneNumber) {
        let phPattern = RegExp('((^\\+? )(([0-9]{2,3})(\\s))?)' + '[0-9]{13}$');
        if (phPattern.test(phoneNumber)) {
            this._phoneNumber = phoneNumber;
        }
        else
            throw 'Invalid Phone Number !';
    }

    //Methods
    toString() {
        return '[ FullName : ' + this._fullName + ' Address : '
            + this.address + ' City : ' + this._city + ' State : ' + this.state + ' Zip : ' + this.zip +
            ' Phone Number : ' + this.phoneNumber + ' ]';
    }
}