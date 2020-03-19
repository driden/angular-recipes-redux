// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';

// Booststrapped
import { AppComponent } from './app.component';

// Modules
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

// Components
import { HeaderComponent } from './header/header.component';

// App Store
import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducers),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    // RecipesModule, ShoppingListModule y AuthModule no los importo eagerly porque ya los importo de manera lazy
    SharedModule,
    CoreModule
  ],
  declarations: [AppComponent, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
