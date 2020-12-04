interface HttpResponse<T> extends Response {
    parsedBody?: T
}

export default class ApiService {
    private serverURL = 'http://localhost';
    private apiBase = `${this.serverURL}:3001/api`;
    public socketURL = `${this.serverURL}:3002`;

    public async http<T>(method: string, url: string, body: Object={}): Promise<HttpResponse<T>> {
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': window.localStorage.getItem('jwt') || ''
            },
            method
        };
        
        if(method === 'post') {
            // @ts-ignore
            options = {...options, body: JSON.stringify(body)};
            console.log(options);
        }
        
        
        const res: HttpResponse<T> = await fetch(url, options);
        res.parsedBody = await res.json();
        return res;
    }
    
    public getTable(id: string): Promise<HttpResponse<any>> {
        return this.http<any>('get', `${this.apiBase}/tables/${id}`, {id});
    }
    
    public checkAuth(): Promise<HttpResponse<any>> {
        return this.http<HttpResponse<any>>('get',`${this.apiBase}/check-auth`);
    }
    
    public auth(email: string, password: string): Promise<HttpResponse<any>> {
        return this.http<HttpResponse<any>>('post', `${this.apiBase}/auth`, {
            email,
            password
        })
    }

    public register(name: string, email: string, password: string): Promise<HttpResponse<any>> {
        return this.http<HttpResponse<any>>('post', `${this.apiBase}/register`, {
            name,
            email,
            password
        })
    }
    
    public createTable(name: string): Promise<HttpResponse<any>> {
        return this.http<HttpResponse<any>>('post', `${this.apiBase}/tables/create`, {
            name
        });
    }
    
    public getAllTables(): Promise<HttpResponse<any>> {
        return this.http<HttpResponse<any>>('get', `${this.apiBase}/tables`); 
    }
}