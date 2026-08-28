import { Routes } from '@angular/router';
import {MainViewComponent} from './views/hub-view/main-view.component';
import {FiltersSubViewComponent} from './views/hub-view/filters-sub-view/filters-sub-view.component';

export const routes: Routes = [
  {
    path: 'main',
    component: MainViewComponent,
    children: [
      { path: 'search', loadComponent: () => import('./views/hub-view/search-sub-view/search-sub-view.component').then((c) => c.SearchSubViewComponent) },
      { path: 'filters', loadComponent: () => import('./views/hub-view/filters-sub-view/filters-sub-view.component').then((c) => c.FiltersSubViewComponent) },
      { path: 'timeline', loadComponent: () => import('./views/hub-view/timeline-sub-view/timeline-sub-view.component').then((c) => c.TimelineSubViewComponent) },
      { path: 'library', loadComponent: () => import('./views/hub-view/library-sub-view/library-sub-view.component').then((c) => c.LibrarySubViewComponent) },
      { path: 'settings', loadComponent: () => import('./views/hub-view/extras-sub-view/extras-sub-view.component').then((c) => c.ExtrasSubViewComponent) },
    ]
  },
  { path: 'work/:workId', loadComponent: () => import('./views/work-view/work-view.component').then((c) => c.WorkViewComponent) },
  { path: 'work/:workId/chapter/:chapterId', loadComponent: () => import('./views/chapter-view/chapter-view.component').then((c) => c.ChapterViewComponent) },
  { path: 'filter/:filterId', loadComponent: () => import('./views/filter-edit/filter-edit.component').then((c) => c.FilterEditComponent) },
  { path: '', redirectTo: 'main/search', pathMatch: 'full', }
];
