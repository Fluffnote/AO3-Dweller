import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from './http';
import {WorkFilter} from '../models/filters/work-filter';
import {CapacitorHttp, HttpParams, HttpResponse} from '@capacitor/core';
import {logger} from './logger';
import {Filter, ParamMap} from '../models/filters/filter';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AO3 {

  constructor(protected http: HttpClient) { }

  private _baseUrl = 'https://archiveofourown.org/';



  // Actual API calls go here
  getSearchPage(filter: WorkFilter, page: number = 1): Observable<any> {
    let temp = new WorkFilter();
    temp.copyFrom(filter); // Need to copy since there is a weird disconnect
    const url = this._baseUrl + temp.searchBase;
    let filterParams = temp.paramMap();
    filterParams.page = page.toString();
    const options = {url, params: filterParams}
    return Http.instance.get(options);
  }

  getWorkPage(id: number): Observable<any> {
    const url = this._baseUrl + 'works/' + id;
    const params = {"view_adult": "true"}
    const options = {url, params}
    return Http.instance.get(options);
  }

  getChapterPage(workId: number, chapterId: number): Observable<any> {
    let url;
    if (chapterId > 0) url = this._baseUrl + 'works/' + workId + '/chapters/' + chapterId;
    else url = this._baseUrl + 'works/' + workId;
    const params = {"view_adult": "true"}
    const options = {url, params}
    return Http.instance.get(options);
  }

  getAutocomplete(section: string, query: string): Observable<any> {
    const url = this._baseUrl + 'autocomplete/' + section//+'?term:' + query;
    const params = {"term": query}
    const options = {url, params, headers: {'Accept': 'application/json'}}
    logger.info(JSON.stringify(options));
    // return this.http.get(url)
    // return this.http.request('GET', url + '?' + 'term='+query, {headers: {'Accept': 'application/json'}});
    // @ts-ignore
    return Http.instance.get(options);
  }

}
