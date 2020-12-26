export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any, label?: string) {
        let config = {
            'required'  : `${label} is required.`,
            'email'     : 'Please enter a valid email address.',
            'min'       : `The lowest value of ${label.toLowerCase()} is ${validatorValue.min}.`,
            'max'       : `The highest value of ${label.toLowerCase()} is ${validatorValue.max}.`,
            'minlength' : `Please enter at least ${validatorValue.requiredLength} characters.`,
            'maxlength' : `Please enter at most ${validatorValue.requiredLength} characters.`,
            'alphanum'  : `Please enter only alphabets or numeric.`,
            'alpha'     : `Please enter only alphabets.`,
            'num'       : `Please enter only digits.`,
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
