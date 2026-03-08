import { Injectable } from '@angular/core';
import {SQL} from '../../DB/sql';
import {concatMap, map, Observable} from 'rxjs';
import {Work} from '../../models/work';
import {createObservable} from '../create-observable';
import {AO3} from '../ao3';
import {WorkParser} from '../../parsers/work-parser';
import {logger} from '../logger';
import {HttpResponse} from '@capacitor/core';
import {ChapterPipeline} from './chapter-pipeline';
import {HistoryMgmt} from '../history-mgmt';

@Injectable({
  providedIn: 'root'
})
export class WorkPipeline {

  constructor(
    private sql: SQL,
    private ao3: AO3
  ) { }

  // Gets Work object
  //
  // [refreshType] = 0 : Doesn't refresh - Only grabs database info
  //
  // [refreshType] = 1 : Soft refresh - Will attempt to refresh info if it has been more than 1 hour from last fetch
  //
  // [refreshType] = 2 : Hard refresh - Will attempt to refresh info regardless of last fetch
  get(id: number, refreshType?: number): Observable<Work> {
    refreshType = refreshType ? refreshType : 0;
    return createObservable(this.DB2Work, this.sql, id).pipe(concatMap(work => this.refreshWork(work as Work, refreshType)));
  }

  private refreshWork(work: Work, refreshType: number): Observable<Work> {
    if (refreshType >= 2 || (refreshType == 1 && work.lastFetchDate.getTime() < new Date().getTime() - (30 * 24 * 60 * 60 * 1000))) { // one month-ish
      return this.ao3.getWorkPage(work.id).pipe(concatMap(response => createObservable(this.responseToWork, this.sql, work, response) as Observable<Work>));
    }

    // Only send db Work
    return new Observable(subscriber => {
      subscriber.next(work);
      subscriber.complete();
    });
  }

  toggleBookmark(work: Work): Observable<Work> {
    return createObservable(this.toggleBookmarkAsync, this.sql, work);
  }

  private async responseToWork(sql:SQL, startObj: Work, response: HttpResponse): Promise<Work> {
    let work = new WorkParser().parse(startObj, new DOMParser().parseFromString(response.data, "text/html"))
    if (work.id != null && work.chapters != null && work.chapters.length > 0) {
      for (let chapter of work.chapters) {
        chapter.history = await HistoryMgmt.DB2History(sql, work.id, chapter.id, false);
      }
    }
    await WorkPipeline.Work2DB(sql, work); // Caching object
    return work;
  }

  private async DB2Work(sql:SQL, id: number): Promise<Work> {
    let work = new Work();
    work.id = id;
    try {
      const works = await sql.queryPromise(`SELECT * FROM WORKS WHERE ID = ${id}`);
      if (works.length > 0) {
        const workData = works[0];
        work.id = workData.ID;
        work.title = workData.TITLE;
        work.author = workData.AUTHOR;
        work.summary = workData.SUMMARY;
        work.ratingSymbol = workData.RATING_SYMBOL;
        work.rpoSymbol = workData.RPO_SYMBOL;
        work.warningSymbol = workData.WARNING_SYMBOL;
        work.statusSymbol = workData.STATUS_SYMBOL;
        work.language = workData.LANGUAGE_ID;
        work.publishedDate = workData.PUBLISHED_DATE != null? new Date(workData.PUBLISHED_DATE) : null;
        work.lastUpdatedDate = workData.LAST_UPDATED_DATE != null? new Date(workData.LAST_UPDATED_DATE) : null;
        work.completeDate = workData.COMPLETE_DATE != null? new Date(workData.COMPLETE_DATE) : null;
        work.chapterStats = workData.CHAPTER_STATS;
        work.words = workData.WORDS;
        work.comments = workData.COMMENTS;
        work.kudos = workData.KUDOS;
        work.bookmarks = workData.BOOKMARKS;
        work.hits = workData.HITS;
        work.lastFetchDate = workData.LAST_FETCHED_DATE != null? new Date(workData.LAST_FETCHED_DATE) : new Date(0);
        work.parserVersion = workData.PARSER_VERSION;

        ////// Tags
        // Rating
        const rating = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 1 AND WT.WORK_ID = ${work.id}`);
        work.rating = rating.length > 0 ? rating[0].TAG : null;
        // Warning
        const warning = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 2 AND WT.WORK_ID = ${work.id}`);
        work.warning = warning.length > 0 ? warning[0].TAG : null;
        // Categories
        const categories = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 3 AND WT.WORK_ID = ${work.id}`);
        work.categories = categories.map(category => category.TAG);
        // Fandoms
        const fandoms = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 4 AND WT.WORK_ID = ${work.id}`);
        work.fandoms = fandoms.map(fandom => fandom.TAG);
        // Relationships
        const relationships = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 5 AND WT.WORK_ID = ${work.id}`);
        work.relationships = relationships.map(relationship => relationship.TAG);
        // Characters
        const characters = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 6 AND WT.WORK_ID = ${work.id}`);
        work.characters = characters.map(character => character.TAG);
        // Freeforms
        const freeforms = await sql.queryPromise(`SELECT TAG FROM TAGS T JOIN WORK_TAGS WT ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = 7 AND WT.WORK_ID = ${work.id}`);
        work.freeforms = freeforms.map(freeform => freeform.TAG);
      }

      work.chapters = await ChapterPipeline.WorkChapters(sql, work.id);
      work.resumeChapterId = await HistoryMgmt.DB2RecentChapterId(sql, work.id);
      if (work.resumeChapterId == null && work.chapters.length > 0) { // If no resume chapter, set to the first chapter
        work.resumeChapterId = work.chapters[0].id;
      }
      work.bookmarked = (await sql.queryPromise(`SELECT WORK_ID FROM LIBRARY WHERE WORK_ID = ${work.id}`)).length > 0;
    }
    catch (err) {
      logger.error((err as Error).message);
      logger.error((err as Error).stack+"");
      work.lastFetchDate = new Date(0);
    }
    return work;
  }

  static async Work2DB(sql:SQL, work: Work): Promise<void> {
    const check = await sql.queryPromise("SELECT * FROM WORKS WHERE id = " + work.id);
    if (check.length == 0) { // Insert
      const insertSQL =
        `INSERT INTO WORKS (ID, TITLE, AUTHOR, SUMMARY, RATING_SYMBOL,
                           RPO_SYMBOL, WARNING_SYMBOL, STATUS_SYMBOL, LANGUAGE_ID, PUBLISHED_DATE,
                           LAST_UPDATED_DATE, COMPLETE_DATE, CHAPTER_STATS, WORDS, COMMENTS,
                           KUDOS, BOOKMARKS, HITS, LAST_FETCHED_DATE, PARSER_VERSION)
         VALUES (?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?,
                 ?, ?, ?, ?, ?)`;
      const params = [
        work.id, work.title, work.author, work.summary, work.ratingSymbol,
        work.rpoSymbol, work.warningSymbol, work.statusSymbol, work.language, work.publishedDate,
        work.lastUpdatedDate, work.completeDate, work.chapterStats, work.words, work.comments,
        work.kudos, work.bookmarks, work.hits, work.lastFetchDate, work.parserVersion
      ];
      await sql.execute(insertSQL, params)
    }
    else { // Update
      const updateSQL =
        `UPDATE WORKS SET TITLE = ?, AUTHOR = ?, SUMMARY = ?, RATING_SYMBOL = ?,
                           RPO_SYMBOL = ?, WARNING_SYMBOL = ?, STATUS_SYMBOL = ?, LANGUAGE_ID = ?, PUBLISHED_DATE = ?,
                           LAST_UPDATED_DATE = ?, COMPLETE_DATE = ?, CHAPTER_STATS = ?, WORDS = ?, COMMENTS = ?,
                           KUDOS = ?, BOOKMARKS = ?, HITS = ?, LAST_FETCHED_DATE = ?, PARSER_VERSION = ?
         WHERE ID = `;
      const params = [
        work.title, work.author, work.summary, work.ratingSymbol,
        work.rpoSymbol, work.warningSymbol, work.statusSymbol, work.language, work.publishedDate,
        work.lastUpdatedDate, work.completeDate, work.chapterStats, work.words, work.comments,
        work.kudos, work.bookmarks, work.hits, work.lastFetchDate, work.parserVersion
      ];
      await sql.execute(updateSQL+work.id, params)
    }

    // Cache tags

    // Rating
    WorkPipeline.updateTags(sql, work.id, work.rating != null ? [work.rating] : [], 1);

    // Warning
    WorkPipeline.updateTags(sql, work.id, work.warning != null ? [work.warning] : [], 2);

    // Categories
    WorkPipeline.updateTags(sql, work.id, work.categories, 3);

    // Fandoms
    WorkPipeline.updateTags(sql, work.id, work.fandoms, 4);

    // Relationships
    WorkPipeline.updateTags(sql, work.id, work.relationships, 5);

    // Characters
    WorkPipeline.updateTags(sql, work.id, work.characters, 6);

    // Freeforms
    WorkPipeline.updateTags(sql, work.id, work.freeforms, 7);


    // Cache chapters
    if (work.chapters != null) {
      for (let chapter of work.chapters) {
        ChapterPipeline.Chapter2DB(sql, chapter)
      }
    }

    logger.info("Work cached")
  }

  private async toggleBookmarkAsync(sql:SQL, work: Work): Promise<Work> {
    if (work.bookmarked) { // remove bookmark
      await sql.execute(`DELETE FROM LIBRARY WHERE WORK_ID = ${work.id}`);
      work.bookmarked = false;
    }
    else { // add bookmark
      await sql.execute(`INSERT INTO LIBRARY (WORK_ID, FOLDER_ID, ORDER_NUM) VALUES(${work.id}, 1, 0)`);
      work.bookmarked = true;
    }
    return work;
  }

  static async updateTags(sql:SQL, work_id: number, tags: string[], tag_type: number): Promise<void> { // probably needs a revisit to speed up
    let tag_new_ids = []
    let tag_old_ids = []
    for (let tag of tags) {
      try {
        await sql.execute("INSERT INTO TAGS(TAG, TAG_TYPE) VALUES (?, ?)", [tag, tag_type])
      } catch (e) { }
      tag_new_ids.push((await sql.queryPromise(`SELECT ID FROM TAGS WHERE TAG = "${tag}"`))[0].ID)
    }
    const tag_check = await sql.queryPromise(`SELECT TAG_ID FROM WORK_TAGS WT JOIN TAGS T ON T.ID = WT.TAG_ID WHERE T.TAG_TYPE = ${tag_type} AND WT.WORK_ID = ${work_id}`)
    for (let tag_id of tag_check) {
      tag_old_ids.push(tag_id.TAG_ID)
    }
    for (let new_id of tag_new_ids) {
      if (!tag_old_ids.includes(new_id)) {
        await sql.execute(`INSERT INTO WORK_TAGS (WORK_ID, TAG_ID) VALUES (?, ?)`, [work_id, new_id]);
      }
    }
    for (let old_id of tag_old_ids) {
      await sql.execute(`DELETE FROM WORK_TAGS WHERE WORK_ID = ${work_id} AND TAG_ID = ${old_id}`);
    }
  }
}
