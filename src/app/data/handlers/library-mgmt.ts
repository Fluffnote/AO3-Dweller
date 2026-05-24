import {Injectable} from '@angular/core';
import {SQL} from '../DB/sql';
import {Subject} from 'rxjs';
import {Work} from '../models/work';
import {logger} from './logger';
import {WorkPipeline} from './class/work-pipeline';

@Injectable({
  providedIn: 'root'
})
export class LibraryMgmt {

  constructor(private sql: SQL) { }


  libraryList: Subject<Work[]> = new Subject<Work[]>()


  async updateLibraryList(): Promise<void> {
    let out: Work[] = [];

    try {
      const query =
        `SELECT W.TITLE, L.WORK_ID
         FROM LIBRARY L
         JOIN WORKS W ON L.WORK_ID = W.ID
         ORDER BY UPPER(W.TITLE) ASC`;

      const worksBookmarked = await this.sql.queryPromise(query);
      if (worksBookmarked.length > 0) {
        for (const workData of worksBookmarked) {
          let work = await WorkPipeline.DB2Work(this.sql, workData.WORK_ID)
          out.push(work)
        }
      }
    }
    catch (err) {
      logger.error((err as Error).message);
      logger.error((err as Error).stack+"");
    }

    this.libraryList.next(out);
  }
}
