import hasValidBearerToken from './hasValidBearerToken';
import injectApiKey from './injectApiKey';
import hasDailyBread from './hasDailyBread';
import hasApiHits from './hasApiHits';

const middlewares = {
    hasValidBearerToken,
    injectApiKey,
    hasDailyBread,
    hasApiHits,
};

export default middlewares;