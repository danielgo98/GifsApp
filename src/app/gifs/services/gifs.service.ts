import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];

  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  private apiKey: string = '6hYOFfzGgsGuwL7MYL3B6EflJLSK3APF';

  constructor(private http: HttpClient ) {
    this.loadLocalStorage();
   }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length == 0) return;

    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag: string): void{

    if(tag.length == 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('q', tag)
    .set('limit', 10);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
    .subscribe( resp => {
      this.gifList = resp.data;
    });

  }

  private organizeHistory(tag: string): void {

    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag != tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0, 10);

    this.saveLocalStorage();

  }

}
