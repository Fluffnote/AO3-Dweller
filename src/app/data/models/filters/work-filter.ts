import {
  CompletionStatusOptions,
  CrossoversOptions,
  LanguageOptions,
  SortColumnOptions,
  SortDirectionOptions
} from '../support/search-options.enum';
import {Filter, ParamMap, TagSet} from './filter';

export class WorkFilter implements Filter {

  searchBase: string = "works/search";

  // Work Info
  query: string = "";
  title: string = "";
  creators: string = "";
  revisedAt: string = "";
  complete: CompletionStatusOptions = "";
  crossover: CrossoversOptions = "";
  languageId: LanguageOptions = "";

  // Work Tags
  ratingIds: string = "";
  archiveWarningIds: string[] = [];
  categoryIds: string[] = [];
  fandomNames: TagSet = new TagSet();
  relationshipNames: TagSet = new TagSet();
  characterNames: TagSet = new TagSet();
  freeformNames: TagSet = new TagSet();

  // Work Stats
  singleChapter: boolean = false;
  wordCount: string = "";
  hitsCount: string = "";
  kudosCount: string = "";
  commentsCount: string = "";
  bookmarksCount: string = "";

  // Search
  sortColumn: SortColumnOptions = "_score";
  sortDirection: SortDirectionOptions = "desc";

  copyFrom(input: WorkFilter) {
    this.query = input.query;
    this.title = input.title;
    this.creators = input.creators;
    this.revisedAt = input.revisedAt;
    this.complete = input.complete;
    this.crossover = input.crossover;
    this.languageId = input.languageId;

    this.ratingIds = input.ratingIds;
    this.archiveWarningIds = JSON.parse(JSON.stringify(input.archiveWarningIds));
    this.categoryIds = JSON.parse(JSON.stringify(input.categoryIds));
    this.fandomNames = JSON.parse(JSON.stringify(input.fandomNames));
    this.relationshipNames = JSON.parse(JSON.stringify(input.relationshipNames));
    this.characterNames = JSON.parse(JSON.stringify(input.characterNames));
    this.freeformNames = JSON.parse(JSON.stringify(input.freeformNames));

    this.singleChapter = input.singleChapter;
    this.wordCount = input.wordCount;
    this.hitsCount = input.hitsCount;
    this.kudosCount = input.kudosCount;
    this.commentsCount = input.commentsCount;
    this.bookmarksCount = input.bookmarksCount;

    this.sortColumn = input.sortColumn;
    this.sortDirection = input.sortDirection;
  }

  public paramMap(): ParamMap {
    let params: ParamMap = {
      // Work Info
      "work_search[query]": (this.query + this.buildTagQueryAddition()),
      "work_search[title]": this.title,
      "work_search[creators]": this.creators,
      "work_search[revised_at]": this.revisedAt,
      "work_search[complete]": this.complete,
      "work_search[crossover]": this.crossover,
      "work_search[single_chapter]": this.singleChapter ? '1' : '0',
      "work_search[word_count]": this.wordCount,
      "work_search[language_id]": this.languageId,

      // Work Tags
      "work_search[rating_ids]": this.ratingIds,
      "work_search[fandom_names]": this.fandomNames.mustHaveTags.join(","),
      "work_search[relationship_names]": this.relationshipNames.mustHaveTags.join(","),
      "work_search[character_names]": this.characterNames.mustHaveTags.join(","),
      "work_search[archive_warning_ids]": this.archiveWarningIds.join(","),
      "work_search[category_ids]": this.categoryIds.join(","),
      "work_search[freeform_names]": this.freeformNames.mustHaveTags.join(","),

      // Work Stats
      "work_search[hits]": this.hitsCount,
      "work_search[kudos_count]": this.kudosCount,
      "work_search[comments_count]": this.commentsCount,
      "work_search[bookmarks_count]": this.bookmarksCount,

      // Search
      "work_search[sort_column]": this.sortColumn,
      "work_search[sort_direction]": this.sortDirection,
      "commit": "Search",
      "page":"1"
    };

    return params;
  }

  private buildTagQueryAddition(): string {
    let out = "";

    let loop : TagSet[] = [this.fandomNames, this.relationshipNames, this.characterNames, this.freeformNames];

    for (let set of loop) {
      for (let tag of set.canHaveTags) {
        out += ` "${tag}"`
      }
      for (let tag of set.excludeTags) {
        out += ` -"${tag}"`
      }
    }

    return out;
  }

}
