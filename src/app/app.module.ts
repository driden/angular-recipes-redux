// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Booststrapped
import { AppComponent } from './app.component';

// Modules
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

// Components
import { HeaderComponent } from './header/header.component';
import { StoreModule } from '@ngrx/store';

// Store
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ shoppingList: shoppingListReducer }),
    // RecipesModule, ShoppingListModule y AuthModule no los importo eagerly porque ya los importo de manera lazy
    SharedModule,
    CoreModule
  ],
  declarations: [AppComponent, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
