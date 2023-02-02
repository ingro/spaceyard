// import { compile } from 'path-to-regexp';
import { generatePath } from 'react-router';
import qs from 'query-string';

export function createRouteHelper(routesList: Record<string, string>, homePath: string = '/') {
    return {
        getUrlForRoute(routeName: string, params: any = {}, query: any = {}): string {
            // const compiler = compile(routesList[routeName]);

            const queryString = qs.stringify(query);

            // const compiled = compiler(params);

            const compiled = generatePath(routesList[routeName], params);

            if (queryString === '') {
                return compiled;
            }

            return `${compiled}?${queryString}`;
        },
        getRoute(routeName: string | null): string {
            if (! routeName) {
                return homePath;
            }
            
            return routesList[routeName];
        }
    };
}
