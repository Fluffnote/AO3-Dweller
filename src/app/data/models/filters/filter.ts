import {WorkFilter} from './work-filter';
import {PeopleFilter} from './people-filter';
import {BookmarkFilter} from './bookmark-filter';
import {TagFilter} from './tag-filter';

export interface Filter {
  searchBase: string;

  copyFrom(input: Filter): void
  paramMap(): object
}

export interface ParamMap {
  [key: string]: any;
  "commit": string;
  "page": string;
}

export class SavedFilter {

  name: string = "New Filter";

  settings : WorkFilter | PeopleFilter | BookmarkFilter | TagFilter | null = null;

}

export class TagSet {
  mustHaveTags : string[] = [];
  canHaveTags : string[] = [];
  excludeTags : string[] = [];
}
