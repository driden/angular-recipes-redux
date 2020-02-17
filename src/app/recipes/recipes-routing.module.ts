import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeDetailResolver } from './recipe-detail/recipe-detail-resolver.service';
import { NoRecipeComponent } from './no-recipe/no-recipe.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipe-list/recipes-resolver.service';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', component: NoRecipeComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: { foo: RecipesResolverService }
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: {
          recipes: RecipesResolverService,
          recipe: RecipeDetailResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}
