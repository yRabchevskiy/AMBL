import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { FileService } from '../../services/file.service';
import * as FileActions from '../actions/file.actions';

@Injectable()
export class FileEffects {
  private actions$ = inject(Actions);
  private fileService = inject(FileService);

  loadFiles$ = createEffect(() => this.actions$.pipe(
    ofType(FileActions.loadFiles),
    mergeMap(({ path }) => 
      from(this.fileService.getFiles(path)).pipe(
        map(files => FileActions.loadFilesSuccess({ files, currentPath: path })),
        catchError(error => of(FileActions.loadFilesFailure({ error: error.message })))
      )
    )
  ));
}