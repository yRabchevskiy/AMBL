import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DatabaseService } from '../../services/database.service';
import * as UserActions from '../actions/user.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private dbService = inject(DatabaseService);

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUsers),
    mergeMap(() => from(this.dbService.getUsers()).pipe(
      map(users => UserActions.loadUsersSuccess({ users })),
      catchError(error => of(UserActions.loadUsersFailure({ error: error.message })))
    ))
  ));

  createUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.createUser),
    mergeMap(({ user }) => from(this.dbService.saveUser(user)).pipe(
      map(result => {
        if (result.success) {
          return UserActions.createUserSuccess({ user: result.data });
        } else {
          return UserActions.createUserFailure({ error: result.error });
        }
      }),
      catchError(error => of(UserActions.createUserFailure({ error: error.message })))
    ))
  ));


}