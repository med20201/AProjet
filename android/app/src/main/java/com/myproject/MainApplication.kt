package com.myproject;

import android.app.Application;
import android.content.res.Configuration;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactHost;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ReactNativeHostWrapper;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    @Override
    public ReactNativeHost getReactNativeHost() {
        return new ReactNativeHostWrapper(
                this,
                new DefaultReactNativeHost(this) {
                    @Override
                  protected List<ReactPackage> getPackages() {
                        List<ReactPackage> packages = new PackageList(this).getPackages();
                        // Add the Firebase package to the list of packages
                        packages.add(new ReactNativeFirebaseAppPackage());
                        return packages;
                    }

                    @Override
                    protected String getJSMainModuleName() {
                        return ".expo/.virtual-metro-entry";
                    }

                    @Override
                    protected boolean getUseDeveloperSupport() {
                        return BuildConfig.DEBUG;
                    }

                    @Override
                    public boolean isNewArchEnabled() {
                        return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                    }

                    @Override
                    public boolean isHermesEnabled() {
                        return BuildConfig.IS_HERMES_ENABLED;
                    }
                }
        );
    }

    @Override
    public ReactHost getReactHost() {
        return ReactNativeHostWrapper.createReactHost(getApplicationContext(), getReactNativeHost());
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        ApplicationLifecycleDispatcher.onApplicationCreate(this);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig);
    }
}
