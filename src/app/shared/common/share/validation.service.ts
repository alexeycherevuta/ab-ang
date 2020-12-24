export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required' : 'Required',
            'minlength' : `Minimum length ${validatorValue.requiredLength}`,
            'maxlength' : `Maximum length ${validatorValue.requiredLength}`,
            'alphanum' : 'Alpha numeric only',
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
}
