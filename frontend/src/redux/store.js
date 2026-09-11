import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import userInforReducer from './slices/userInforSlice';
import postReducer from './slices/postSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'], // Chỉ persist auth (but we will strip sensitive fields)
    transforms: [
        // Strip accessToken before writing to storage and ensure rehydrated token is empty
        createTransform(
            // inbound: state -> persisted
            (inboundState, key) => {
                if (!inboundState) return inboundState;
                const next = { ...inboundState };
                if (next.login) {
                    return {
                        ...next,
                        login: {
                            ...next.login,
                            accessToken: '',
                        },
                    };
                }
                return next;
            },
            // outbound: state -> rehydrated
            (outboundState, key) => {
                if (!outboundState) return outboundState;
                const next = { ...outboundState };
                if (next.login) {
                    return {
                        ...next,
                        login: {
                            ...next.login,
                            accessToken: '',
                        },
                    };
                }
                return next;
            },
            { whitelist: ['auth'] }
        ),
    ],
};
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    userInfor: userInforReducer,
    post: postReducer,

});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer, // Enable persist với whitelist
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
