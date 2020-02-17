import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Services
import { RecipesService } from './recipes/recipes.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { RecipeDetailResolver } from './recipes/recipe-detail/recipe-detail-resolver.service';

@NgModule({
  providers: [
    ShoppingListService,
    RecipesService,
    RecipeDetailResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {}
