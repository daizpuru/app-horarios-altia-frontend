import { Observable } from 'rxjs';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Note } from '../note';
import { NoteFilter } from '../note-filter';
import { NoteService } from '../note.service';
import { SortableHeaderDirective, SortEvent } from './sortable.directive';

@Component({
  selector: 'app-note',
  templateUrl: 'note-list.component.html'
})
export class NoteListComponent implements OnInit {

  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

  filter = new NoteFilter();
  selectedNote!: Note;
  feedback: any = {};

  total$!: Observable<any>;

  get noteList(): Note[] {
    return this.noteService.noteList;
  }

  constructor(private noteService: NoteService) {
  }

  ngOnInit() {
    this.search();
  }

  search(): void {
    this.noteService.load(this.filter);
    this.total$ = this.noteService.size$;
  }

  onChange(pageSize: number) {
    this.filter.size = pageSize;
    this.filter.page = 0;
    this.search();
  }

  onPageChange(page: number) {
    this.filter.page = page - 1;
    this.search();
  }

  onSort({ column, direction }: SortEvent) {
    // reset other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.filter.column = column;
    this.filter.direction = direction;
    this.filter.page = 0;
    this.search();
  }

  select(selected: Note): void {
    this.selectedNote = selected;
  }

  delete(note: Note): void {
    if (confirm('Are you sure?')) {
      this.noteService.delete(note).subscribe(() => {
        this.feedback = { type: 'success', message: 'Delete was successful!' };
        setTimeout(() => {
          this.search();
        }, 1000);
      },
        err => {
          this.feedback = { type: 'warning', message: 'Error deleting.' };
        }
      );
    }
  }

}
