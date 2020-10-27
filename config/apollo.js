import {ApolloClient} from '@apollo/client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import { AsyncStorage } from 'react-native';

const httpLink = createHttpLink({uri: 'http://10.0.2.2:4000/'});

const authlink = setContext( async(_, {headers})=> {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authlink.concat(httpLink)
});

export default client;