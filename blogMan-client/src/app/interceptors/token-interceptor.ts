import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/catch';
import { UserDataService } from '../shared/user-data.service';


@Injectable()

export class TokenInterceptor implements HttpInterceptor{
    constructor(public auth: UserDataService){}
    intercept(req:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        let request = req.clone({
            headers: req.headers.set('authorization', `Bearer ${this.auth.getToken()}`)
        });
       return next.handle(request)
       .catch((err, caught)=>{
           if(err){
            return Observable.throw(err)
           }
       }) as any;
    }
}