import localConfig from './localSettings';
let config = localConfig || {};
config.webDir = 'dist/AO3-Dweller/browser';
config.plugins = {
    StatusBar: {
        overlaysWebView: false,
        style: "dark",
        backgroundColor: "#970000"
    },
    CapacitorSQLite: {
        iosDatabaseLocation: 'Library/Database',
        iosIsEncryption: false,
        iosKeychainPrefix: 'ao3-dweller',
        iosBiometric: {
            biometricAuth: false,
            biometricTitle: "Biometric login for capacitor sqlite"
        },
        androidIsEncryption: false,
        androidBiometric: {
            biometricAuth: false,
            biometricTitle: "Biometric login for capacitor sqlite",
            biometricSubTitle: "Log in using your biometric"
        }
    },
    CapacitorHttp: {
        enabled: true
    }
};
export default config;
