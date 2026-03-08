import {Injectable} from '@angular/core';
import {SQL} from '../DB/sql';

@Injectable({
  providedIn: 'root'
})
export class LibraryMgmt {
  constructor(sql: SQL) { }
}
