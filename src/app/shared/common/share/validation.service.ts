export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any, label?: string) {
        let config = {
            'required'  : `${label} is required.`,
            'email'     : 'Please enter a valid email address.',
            'emailcomplete'     : 'Please enter a valid email address.',
            'min'       : `The lowest value of ${label.toLowerCase()} is ${validatorValue.min}.`,
            'max'       : `The highest value of ${label.toLowerCase()} is ${validatorValue.max}.`,
            'minlength' : `Please enter at least ${validatorValue.requiredLength} characters.`,
            'maxlength' : `Please enter no more than ${validatorValue.requiredLength} characters.`,
            'alphanumaddr'  : `Please enter only alphabets, numeric or character(- . /).`,
            'alphanum'  : `Please enter only alphabets or numeric.`,
            'alpha'     : `Please enter only alphabets.`,
            'num'       : `Please enter only digits.`,
            'fax'       : `Please enter a valid fax number.`,
            'webaddr'   : `Please enter a valid website address.`,
        };
        let errorMessage: string = config[validatorName] ? config[validatorName] : `${label} invalid`;
        return errorMessage;
    }
    static emailCompleteValidator(input) {
        let regex = new RegExp(/^\-$|^([a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,})*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'emailcomplete': true };
        }
    }
    static numValidator(input) {
        let regex = new RegExp(/^\-$|^[0-9]*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'num': true };
        }
    }
    static decimalNumValidator(input) {
        let regex = new RegExp(/^\-$|^[0-9.]*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'num': true };
        }
    }
    static alphaNumAddressValidator(input) {
        let regex = new RegExp(/^\-$|^[a-zA-Z0-9-.\/]+( [a-zA-Z0-9-.\/]+)*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'alphanumaddr': true };
        }
    }
    static alphaNumValidator(input) {
        let regex = new RegExp(/^\-$|^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'alphanum': true };
        }
    }
    static alphaValidator(input) {
        let regex = new RegExp(/^\-$|^[a-zA-Z]+( [a-zA-Z]+)*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'alpha': true };
        }
    }
    static faxValidator(input) {
        let regex = new RegExp(/^\-$|^(\+?\d{1,}(\-?)\d*(\-?)\(?\d{2,}\)?(\-?)\d{3,}\d{3,})*$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'fax': true };
        }
    }
    static webAddressValidator(input) {
        let regex = new RegExp(/^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
        if (regex.test(input.value) || input.value == null || input.value == '') {
            return null;
        } else {
            return { 'webaddr': true };
        }
    }
}
