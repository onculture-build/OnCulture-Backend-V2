import { IntegrationQuery } from "../../company/interfaces";

export const buildIntegrationQuery = (queryParam:IntegrationQuery) => {
    const query = {}

    if (queryParam?.environment) {
        query['environment'] = queryParam?.environment
    }

    if (queryParam?.integration_type) {
        query['integration_type'] = queryParam?.integration_type
    }

    if (queryParam?.version) {
        query['version'] = queryParam?.version
    }

    if (queryParam?.source) {
        query['source'] = queryParam?.source
    }

    return query
}