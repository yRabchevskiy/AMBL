import { Component, inject } from '@angular/core';
import { FileService } from '../../services/file.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as FileActions from '../../state/actions/file.actions';
import * as FileSelectors from '../../state/selectors/file.selectors';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explorer.html',
  styleUrl: './explorer.scss',
})

export class ExplorerComponent {
  private store = inject(Store);
  private fileService = inject(FileService);

  // Стріми даних зі стору
  items$ = this.store.select(FileSelectors.selectAllFiles);
  currentPath$ = this.store.select(state => state.files.currentPath);
  isLoading$ = this.store.select(FileSelectors.selectIsLoading);

  async chooseFolder() {
    const path = await this.fileService.selectFolder();

    // ДОДАЙТЕ ЦЮ ПЕРЕВІРКУ:
    if (path) {
      console.log('Відправляємо шлях до Store:', path);
      this.store.dispatch(FileActions.loadFiles({ path }));
    } else {
      console.warn('Користувач скасував вибір папки');
    }
  }

  openFolder(folderPath: string) {
    this.store.dispatch(FileActions.loadFiles({ path: folderPath }));
  }
}