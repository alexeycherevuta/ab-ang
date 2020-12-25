export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required'  : 'Required',
            'minlength' : `Minimum length ${validatorValue.requiredLength}`,
            'maxlength' : `Maximum length ${validatorValue.requiredLength}`,
            'alphanum'  : 'Alphabets & numeric only',
            'alpha'     : 'Alphabets only',
            'num'       : 'Numeric only',
        };
        return config[validatorName];
    }
    static alphaNumValidator(input) {
        let regex = new RegExp(/^[a-zA-Z0-9]*$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'alphanum': true };
        }
    }
    static alphaValidator(input) {
        let regex = new RegExp(/^[a-zA-Z]+$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'alpha': true };
        }
    }
    static numValidator(input) {
        let regex = new RegExp(/^[0-9]+$/);
        if (regex.test(input.value)) {
            return null;
        } else {
            return { 'num': true };
        }
    }
}
