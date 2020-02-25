import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Services
import { RecipesService } from './recipes/recipes.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { RecipeDetailResolver } from './recipes/recipe-detail/recipe-detail-resolver.service';

@NgModule({
  providers: [
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
