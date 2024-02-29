import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{catchError, tap, Observable, throwError, BehaviorSubject } from 'rxjs';
import { prediction } from './prediction';
import { predictionRequest } from './predictionRequest';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  currentPredictionData: BehaviorSubject<prediction>=new BehaviorSubject<prediction>({prediction:0});
  constructor(private _http:HttpClient) { }

prediction(data: predictionRequest): Observable<prediction> {
  return this._http.post<prediction>('http://localhost:5000/predict', data).pipe(
    tap((predictionData: prediction) => {
      this.currentPredictionData.next(predictionData);
    }),
    catchError(this.handleError)
  )

}

private handleError(error:HttpErrorResponse){
  if (error.status===0){
    console.error('An error occurred:', error.error);
}
else{
  console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
  
}
return throwError(()=> Error('Something bad happened; please try again later.'))
}

get userData():Observable<prediction>{
return this.currentPredictionData.asObservable();
}


}

