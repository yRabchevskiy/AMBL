import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, take } from 'rxjs/operators';
import * as StructureActions from '../actions/structure.actions';
import { IStructure } from '../../models/structure.model';
import { union } from 'd3';

@Injectable()
export class StructureEffects {
  private actions$ = inject(Actions);

  loadAllStructures$ = createEffect(() => this.actions$.pipe(
    ofType(StructureActions.loadAllStructures),
    switchMap(() =>
      from(window.electronAPI.invoke('get-all-structures')).pipe(
        map(res => res.success
          ? StructureActions.loadAllStructuresSuccess({ structures: res.data.map((s: IStructure) => ({ ...s, unions: [] })) })
          : StructureActions.operationFailure({ error: res.error })
        ),
        catchError(err => of(StructureActions.operationFailure({ error: err.message })))
      )
    )
  ));

  // Завантаження всієї структури
  loadStructure$ = createEffect(() => this.actions$.pipe(
    // Слухаємо новий екшен "Вибрати та завантажити"
    ofType(StructureActions.selectAndLoadStructure),

    // Використовуємо switchMap: якщо користувач швидко клацне на іншу структуру, 
    // попередній запит буде скасовано
    switchMap(({ structure }) =>
      from(window.electronAPI.getStructure(structure._id)).pipe(
        map(res => {
          if (res.success) {
            // Повертаємо LoadSuccess з повними даними (уніони і т.д.)
            return StructureActions.loadStructureSuccess({ data: res.data });
          } else {
            return StructureActions.operationFailure({ error: res.error });
          }
        }),
        catchError(err => of(StructureActions.operationFailure({ error: err.message })))
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
      // Додаємо звичайний Promise.resolve для тесту, щоб зрозуміти чи проблема в IPC
      from(window.electronAPI.createStructure({ name })).pipe(
        take(1), // Гарантуємо завершення після першої відповіді
        map(res => {
          console.log('Відповідь в ефекті:', res); // Перевір консоль браузера
          if (res.success) {
            return StructureActions.createStructureSuccess({ structure: res.data });
          }
          return StructureActions.operationFailure({ error: res.error });
        }),
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