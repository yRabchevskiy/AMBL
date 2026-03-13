import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import * as StructureActions from '../actions/structure.actions';

@Injectable()
export class StructureEffects {
  private actions$ = inject(Actions);

  // Завантаження всієї структури
  loadStructure$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.loadStructure),
    switchMap(({ structureId }) =>
      from(window.electronAPI.getStructure(structureId)).pipe(
        map(res => res.success
          ? StructureActions.loadStructureSuccess({ data: res.data })
          : StructureActions.loadStructureFailure({ error: res.error })
        ),
        catchError(err => of(StructureActions.loadStructureFailure({ error: err.message })))
      )
    )
  ));

  deleteStructure$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.deleteStructure),
    mergeMap(({ structureId }) =>
      from(window.electronAPI.deleteStructure(structureId)).pipe(
        map(res => res.success
          ? StructureActions.deleteStructureSuccess()
          : StructureActions.operationFailure({ error: res.error })
        ),
        catchError(err => of(StructureActions.operationFailure({ error: err.message })))
      )
    )
  ));

  updateStructureName$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.updateStructureName),
    mergeMap(({ structureId, name }) =>
      from(window.electronAPI.invoke('update-structure-name', { structureId, name })).pipe(
        map(res => res.success
          ? StructureActions.updateStructureNameSuccess({ structure: res.data })
          : StructureActions.operationFailure({ error: res.error })
        ),
        catchError(err => of(StructureActions.operationFailure({ error: err.message })))
      )
    )
  ));

  createStructure$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.createStructure),
    mergeMap(({ name }) =>
      from(window.electronAPI.createStructure({ name })).pipe(
        map(res => res.success
          ? StructureActions.createStructureSuccess({ structure: res.data })
          : StructureActions.operationFailure({ error: res.error })
        ),
        catchError(err => of(StructureActions.operationFailure({ error: err.message })))
      )
    )
  ));

  // Створення підрозділу (Union)
  createUnion$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.createUnion),
    mergeMap(({ payload }) =>
      from(window.electronAPI.createUnion(payload)).pipe(
        map(res => res.success
          ? StructureActions.createUnionSuccess({ union: res.data })
          : StructureActions.operationFailure({ error: res.error })
        )
      )
    )
  ));

  // Додавання позиції
  addPosition$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.addPosition),
    mergeMap(({ unionId, positionName }) =>
      from(window.electronAPI.addPosition({ unionId, positionName })).pipe(
        map(res => res.success
          ? StructureActions.updateUnionSuccess({ union: res.data })
          : StructureActions.operationFailure({ error: res.error })
        )
      )
    )
  ));

  // Призначення користувача на позицію
  assignUser$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.assignUser),
    mergeMap(({ unionId, positionId, userId }) =>
      from(window.electronAPI.assignUserToPosition({ unionId, positionId, userId })).pipe(
        map(res => res.success
          ? StructureActions.updateUnionSuccess({ union: res.data })
          : StructureActions.operationFailure({ error: res.error })
        )
      )
    )
  ));

  // Видалення позиції
  deletePosition$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.deletePosition),
    mergeMap(({ unionId, positionId }) =>
      from(window.electronAPI.deletePosition({ unionId, positionId })).pipe(
        map(res => res.success
          ? StructureActions.updateUnionSuccess({ union: res.data })
          : StructureActions.operationFailure({ error: res.error })
        )
      )
    )
  ));
}