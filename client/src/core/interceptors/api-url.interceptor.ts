import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip if the request is for an external URL or already has a full URL
  if (req.url.startsWith('http') || req.url.startsWith('//')) {
    return next(req);
  }

  const apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
  return next(apiReq);
};
