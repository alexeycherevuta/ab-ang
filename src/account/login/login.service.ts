import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    TokenAuthServiceProxy,
    AuthenticateModel,
    AuthenticateResultModel,
    ExternalLoginProviderInfoModel,
    ExternalAuthenticateModel,
    ExternalAuthenticateResultModel
} from '@shared/service-proxies/service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { MessageService } from '@abp/message/message.service';
import { LogService } from '@abp/log/log.service';
import { TokenService } from '@abp/auth/token.service';
import { UtilsService } from '@abp/utils/utils.service';
import * as _ from 'lodash';
declare const FB: any; 
declare const gapi: any; 
declare const WL: any; 
export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {
    static readonly FACEBOOK: string = 'Facebook';
    static readonly GOOGLE: string = 'Google';
    static readonly MICROSOFT: string = 'Microsoft';
    icon: string;
    initialized = false;
    constructor(providerInfo: ExternalLoginProviderInfoModel) {
        super();
        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.icon = ExternalLoginProvider.getSocialIcon(this.name);
    }
    private static getSocialIcon(providerName: string): string {
        providerName = providerName.toLowerCase();
        if (providerName === 'google') {
            providerName = 'googleplus';
        }
        return providerName;
    }
}
@Injectable()
export class LoginService {
    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';
    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    externalLoginProviders: ExternalLoginProvider[] = [];
    rememberMe: boolean;
    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _utilsService: UtilsService,
        private _messageService: MessageService,
        private _tokenService: TokenService,
        private _logService: LogService
    ) {
        this.clear();
    }
    authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
        finallyCallback = finallyCallback || (() => { });
        this.authenticateModel.twoFactorRememberClientToken = this._utilsService.getCookieValue(LoginService.twoFactorRememberClientTokenName);
        this.authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
        this.authenticateModel.returnUrl = UrlHelper.getReturnUrl();
        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result, redirectUrl);
            });
    }
    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {
            if (provider.name === ExternalLoginProvider.FACEBOOK) {
                FB.login();
            } else if (provider.name === ExternalLoginProvider.GOOGLE) {
                gapi.auth2.getAuthInstance().signIn();
            } else if (provider.name === ExternalLoginProvider.MICROSOFT) {
                WL.login({
                    scope: ['wl.signin', 'wl.basic', 'wl.emails']
                });
            }
        });
    }
    init(): void {
        this.initExternalLoginProviders();
    }
    private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
        this.authenticateResult = authenticateResult;
        if (authenticateResult.shouldResetPassword) {
            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });
            this.clear();
        } else if (authenticateResult.requiresTwoFactorVerification) {
            this._router.navigate(['account/send-code']);
        } else if (authenticateResult.accessToken) {
            if (authenticateResult.returnUrl && !redirectUrl) {
                redirectUrl = authenticateResult.returnUrl;
            }
            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe,
                authenticateResult.twoFactorRememberClientToken,
                redirectUrl
            );
        } else {
            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);
        }
    }
    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string, redirectUrl?: string): void {
        let tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;
        this._tokenService.setToken(
            accessToken,
            tokenExpireDate
        );
        this._utilsService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );
        if (twoFactorRememberClientToken) {
            this._utilsService.setCookieValue(
                LoginService.twoFactorRememberClientTokenName,
                twoFactorRememberClientToken,
                new Date(new Date().getTime() + 365 * 86400000), 
                abp.appPath
            );
        }
        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            let initialUrl = UrlHelper.initialUrl;
            if (initialUrl.indexOf('/account') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }
            location.href = initialUrl;
        }
    }
    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }
    private initExternalLoginProviders() {
        this._tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _.map(providers, p => new ExternalLoginProvider(p));
            });
    }
    ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider, callback: () => void) {
        if (loginProvider.initialized) {
            callback();
            return;
        }
        if (loginProvider.name === ExternalLoginProvider.FACEBOOK) {
            jQuery.getScript('
                FB.init({
                    appId: loginProvider.clientId,
                    cookie: false,
                    xfbml: true,
                    version: 'v2.5'
                });
                FB.getLoginStatus(response => {
                    this.facebookLoginStatusChangeCallback(response);
                });
                callback();
            });
        } else if (loginProvider.name === ExternalLoginProvider.GOOGLE) {
            jQuery.getScript('https:
                gapi.load('client:auth2',
                    () => {
                        gapi.client.init({
                            clientId: loginProvider.clientId,
                            scope: 'openid profile email'
                        }).then(() => {
                            gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                                this.googleLoginStatusChangeCallback(isSignedIn);
                            });
                            this.googleLoginStatusChangeCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
                        });
                        callback();
                    });
            });
        } else if (loginProvider.name === ExternalLoginProvider.MICROSOFT) {
            jQuery.getScript('
                WL.Event.subscribe('auth.login', this.microsoftLogin);
                WL.init({
                    client_id: loginProvider.clientId,
                    scope: ['wl.signin', 'wl.basic', 'wl.emails'],
                    redirect_uri: AppConsts.appBaseUrl,
                    response_type: 'token'
                });
            });
        }
    }
    private facebookLoginStatusChangeCallback(resp) {
        if (resp.status === 'connected') {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.FACEBOOK;
            model.providerAccessCode = resp.authResponse.accessToken;
            model.providerKey = resp.authResponse.userID;
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();
            this._tokenAuthService.externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info('You have successfully registered. Waiting for activation!');
                        return;
                    }
                    this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
                });
        }
    }
    private googleLoginStatusChangeCallback(isSignedIn) {
        if (isSignedIn) {
            const model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.GOOGLE;
            model.providerAccessCode = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            model.providerKey = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();
            model.singleSignIn = UrlHelper.getSingleSignIn();
            model.returnUrl = UrlHelper.getReturnUrl();
            this._tokenAuthService.externalAuthenticate(model)
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if (result.waitingForActivation) {
                        this._messageService.info('You have successfully registered. Waiting for activation!');
                        return;
                    }
                    this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
                });
        }
    }
    private microsoftLogin() {
        this._logService.debug(WL.getSession());
        const model = new ExternalAuthenticateModel();
        model.authProvider = ExternalLoginProvider.MICROSOFT;
        model.providerAccessCode = WL.getSession().access_token;
        model.providerKey = WL.getSession().id; 
        model.singleSignIn = UrlHelper.getSingleSignIn();
        model.returnUrl = UrlHelper.getReturnUrl();
        this._tokenAuthService.externalAuthenticate(model)
            .subscribe((result: ExternalAuthenticateResultModel) => {
                if (result.waitingForActivation) {
                    this._messageService.info('You have successfully registered. Waiting for activation!');
                    return;
                }
                this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
            });
    }
}
