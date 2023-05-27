import hasValidBearerToken from './hasValidBearerToken';
import hasValidRefreshToken from './hasValidRefreshToken';
import injectApiKey from './injectApiKey';

const middlewares = {
    hasValidBearerToken,
    injectApiKey,
    hasValidRefreshToken,
};

export default middlewares;