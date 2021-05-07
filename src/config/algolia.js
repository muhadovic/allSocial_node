import algolia from 'algoliasearch';

const index = algolia(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_WRITE_KEY).initIndex(process.env.ALGOLIA_INDEX);

export default index;
